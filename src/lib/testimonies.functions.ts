import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  AUDIO_MAX_BYTES,
  AUDIO_TYPES,
  PHOTO_MAX_BYTES,
  PHOTO_TYPES,
  TESTIMONY_CATEGORIES,
} from "./testimony-rules";

export { TESTIMONY_CATEGORIES } from "./testimony-rules";

const BUCKET = "testimony-media";
const PAGE_SIZE = 12;
const RATE_LIMIT = 5;

const textSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
    email: z.string().trim().email("Please enter a valid email address.").max(200),
    location: z.string().trim().max(120).optional(),
    title: z.string().trim().min(3, "Please add a testimony title.").max(160),
    testimony: z.string().trim().max(6000).optional(),
    category: z.enum(TESTIMONY_CATEGORIES).optional(),
    consent: z.literal(true, { errorMap: () => ({ message: "Publication consent is required." }) }),
    website: z.string().max(0, "Submission rejected.").optional(),
  });

type SubmitInput = z.infer<typeof textSchema> & { audio?: File; photo?: File };

function str(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" && value.trim() ? value : undefined;
}

function file(form: FormData, key: string) {
  const value = form.get(key);
  return value instanceof File && value.size > 0 ? value : undefined;
}

function parseSubmission(input: unknown): SubmitInput {
  if (!(input instanceof FormData)) throw new Error("Invalid submission.");
  const parsed = textSchema.parse({
    fullName: str(input, "fullName") ?? "",
    email: str(input, "email") ?? "",
    location: str(input, "location"),
    title: str(input, "title") ?? "",
    testimony: str(input, "testimony"),
    category: str(input, "category"),
    consent: input.get("consent") === "true",
    website: str(input, "website"),
  });
  const audio = file(input, "audio");
  const photo = file(input, "photo");
  if (audio && (!AUDIO_TYPES[audio.type] || audio.size > AUDIO_MAX_BYTES)) {
    throw new Error("Audio must be MP3, M4A, AAC, WAV, OGG or WebM and under 10 MB.");
  }
  if (photo && (!PHOTO_TYPES[photo.type] || photo.size > PHOTO_MAX_BYTES)) {
    throw new Error("Photo must be JPEG, PNG or WebP and under 5 MB.");
  }
  if ((!parsed.testimony || parsed.testimony.length < 20) && !audio) {
    throw new Error("Please write at least 20 characters or attach an audio testimony.");
  }
  return { ...parsed, audio, photo };
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const submitTestimony = createServerFn({ method: "POST" })
  .inputValidator(parseSubmission)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ip = (getRequestHeader("cf-connecting-ip") || getRequestHeader("x-nf-client-connection-ip") || getRequestHeader("x-forwarded-for") || "unknown").split(",")[0]!.trim();
    const ipHash = await sha256(`testimony:${ip}`);
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("submission_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_LIMIT) {
      return { ok: false, message: "Too many submissions from this connection. Please try again in an hour." };
    }
    await supabaseAdmin.from("submission_attempts").insert({ ip_hash: ipHash });

    const uploaded: string[] = [];
    const upload = async (f: File, folder: "audio" | "photos", ext: string) => {
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, await f.arrayBuffer(), {
        contentType: f.type,
        upsert: false,
      });
      if (error) throw new Error("upload");
      uploaded.push(path);
      return path;
    };

    try {
      const audioPath = data.audio ? await upload(data.audio, "audio", AUDIO_TYPES[data.audio.type]!) : null;
      const photoPath = data.photo ? await upload(data.photo, "photos", PHOTO_TYPES[data.photo.type]!) : null;
      const { error } = await supabaseAdmin.from("testimonies").insert({
        full_name: data.fullName,
        email: data.email,
        location: data.location || null,
        title: data.title,
        testimony: data.testimony || null,
        story: "",
        category: data.category || null,
        consent: true,
        consent_to_publish: true,
        status: "pending",
        audio_url: audioPath,
        image_url: photoPath,
      });
      if (error) throw new Error("insert");
    } catch (error) {
      console.error("Testimony submission failed", error instanceof Error ? error.message : "unknown");
      if (uploaded.length) await supabaseAdmin.storage.from(BUCKET).remove(uploaded);
      return { ok: false, message: "We could not receive your testimony. Please try again." };
    }

    void notifyModerators(data.title);
    return {
      ok: true,
      message: "Thank you. Your testimony has been received for review; submission does not guarantee publication.",
    };
  });

async function notifyModerators(title: string) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env["RESEND_FROM"] ?? "website@seedofchrist.org",
        to: ["admin@seedofchrist.org"],
        subject: "New testimony awaiting review",
        text: `A new testimony ("${title.slice(0, 160)}") is waiting for review on the website moderation page.`,
      }),
    });
  } catch {
    /* notification is optional */
  }
}

export type PublicTestimony = {
  id: string;
  full_name: string;
  location: string | null;
  title: string;
  testimony: string;
  category: string | null;
  published_at: string;
  image_url: string | null;
  audio_url: string | null;
};

const PUBLIC_COLUMNS = "id, full_name, location, title, testimony, story, category, published_at, image_url, audio_url";

function publicClient() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("The testimony service is unavailable.");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

type Row = {
  id: string; full_name: string; location: string | null; title: string; testimony: string | null;
  story: string; category: string | null; published_at: string | null; image_url: string | null; audio_url: string | null;
};

async function signPaths(paths: string[], seconds: number) {
  const unique = [...new Set(paths.filter(Boolean))];
  if (!unique.length) return new Map<string, string>();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrls(unique, seconds);
  return new Map((data ?? []).filter((d) => d.signedUrl && d.path).map((d) => [d.path!, d.signedUrl]));
}

async function toPublic(rows: Row[]): Promise<PublicTestimony[]> {
  const signed = await signPaths(rows.flatMap((r) => [r.image_url ?? "", r.audio_url ?? ""]), 60 * 60);
  return rows
    .filter((r) => r.published_at)
    .map((r) => ({
      id: r.id,
      full_name: r.full_name,
      location: r.location,
      title: r.title,
      testimony: r.testimony ?? r.story ?? "",
      category: r.category,
      published_at: r.published_at!,
      image_url: r.image_url ? signed.get(r.image_url) ?? null : null,
      audio_url: r.audio_url ? signed.get(r.audio_url) ?? null : null,
    }));
}

export const getPublishedTestimonies = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ page: z.number().int().min(1).max(500).default(1) }).parse(input ?? {}))
  .handler(async ({ data }) => {
    const from = (data.page - 1) * PAGE_SIZE;
    const { data: rows, error, count } = await publicClient()
      .from("testimonies")
      .select(PUBLIC_COLUMNS, { count: "exact" })
      .eq("status", "approved")
      .order("published_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error("Published testimonies could not be loaded.");
    return {
      items: await toPublic((rows ?? []) as Row[]),
      page: data.page,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
      total: count ?? 0,
    };
  });

export const getPublishedTestimony = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("testimonies")
      .select(PUBLIC_COLUMNS)
      .eq("id", data.id)
      .eq("status", "approved")
      .maybeSingle();
    if (error) throw new Error("This testimony could not be loaded.");
    if (!row) return null;
    return (await toPublic([row as Row]))[0] ?? null;
  });

/* ---------------- Admin moderation ---------------- */

async function assertAdmin(context: { supabase: ReturnType<typeof createClient<Database>>; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const STATUSES = ["pending", "approved", "rejected", "archived"] as const;

export const listForModeration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ status: z.enum(STATUSES) }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("testimonies")
      .select("id, full_name, email, location, title, testimony, story, category, status, rejection_reason, submitted_at, reviewed_at, published_at, image_url, audio_url")
      .eq("status", data.status)
      .order("submitted_at", { ascending: false })
      .limit(100);
    if (error) throw new Error("Could not load testimonies.");
    const signed = await signPaths((rows ?? []).flatMap((r) => [r.image_url ?? "", r.audio_url ?? ""]), 15 * 60);
    return (rows ?? []).map((r) => ({
      ...r,
      testimony: r.testimony ?? r.story,
      image_signed: r.image_url ? signed.get(r.image_url) ?? null : null,
      audio_signed: r.audio_url ? signed.get(r.audio_url) ?? null : null,
    }));
  });

export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: Boolean(data) };
  });

export const moderateTestimony = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      id: z.string().uuid(),
      action: z.enum(["approve", "reject", "archive"]),
      reason: z.string().trim().max(1000).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    const base = { reviewed_at: now, reviewed_by: context.userId };
    const update =
      data.action === "approve"
        ? { ...base, status: "approved", published_at: now, rejection_reason: null }
        : data.action === "reject"
          ? { ...base, status: "rejected", published_at: null, rejection_reason: data.reason || null }
          : { ...base, status: "archived", published_at: null };
    const { error } = await supabaseAdmin.from("testimonies").update(update).eq("id", data.id);
    if (error) throw new Error("Could not update this testimony.");
    return { ok: true };
  });
