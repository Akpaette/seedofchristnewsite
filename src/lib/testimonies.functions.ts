import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
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

export const submitTestimony = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const schema = z.object({
      fullName: z.string().trim().min(2).max(120),
      email: z.string().trim().email().max(200),
      location: z.string().trim().max(120).optional(),
      title: z.string().trim().min(3).max(160),
      testimony: z.string().trim().max(6000).optional(),
      category: z.enum(TESTIMONY_CATEGORIES).optional(),
      consent: z.literal(true),
      website: z.string().max(0).optional(),
      audioName: z.string().max(180).optional(),
      audioType: z.string().max(80).optional(),
      audioSize: z.number().int().nonnegative().max(AUDIO_MAX_BYTES).optional(),
      photoName: z.string().max(180).optional(),
      photoType: z.string().max(80).optional(),
      photoSize: z.number().int().nonnegative().max(PHOTO_MAX_BYTES).optional(),
    });
    const parsed = schema.parse(input);
    if (parsed.audioSize && (!parsed.audioType || !AUDIO_TYPES[parsed.audioType] || !parsed.audioName?.toLowerCase().endsWith(`.${AUDIO_TYPES[parsed.audioType]}`))) throw new Error("Unsupported audio format.");
    if (parsed.photoSize && (!parsed.photoType || !PHOTO_TYPES[parsed.photoType] || !parsed.photoName?.toLowerCase().endsWith(`.${PHOTO_TYPES[parsed.photoType]}`))) throw new Error("Unsupported photo format.");
    if ((!parsed.testimony || parsed.testimony.length < 20) && !parsed.audioSize && !parsed.photoSize) throw new Error("Please write a testimony or attach audio or photo evidence.");
    return parsed;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ipHash = "browser-submit-" + crypto.randomUUID();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: rateError } = await supabaseAdmin.from("submission_attempts")
      .select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if (rateError) throw new Error("Submission service unavailable.");
    if ((count ?? 0) >= 5) return { ok: false, message: "Too many submissions. Please try again in an hour." };
    await supabaseAdmin.from("submission_attempts").insert({ ip_hash: ipHash });
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) form.set(key, typeof value === "string" ? value : String(value));
    });
    const upload = async (name: string | undefined, type: string | undefined, path: string | undefined, folder: "audio" | "photos") => {
      if (!name || !type || !path) return null;
      const { supabaseAdmin: admin } = await import("@/integrations/supabase/client.server");
      const response = await fetch(path);
      if (!response.ok) throw new Error("Could not read uploaded file.");
      const bytes = new Uint8Array(await response.arrayBuffer());
      const ext = folder === "audio" ? AUDIO_TYPES[type] : PHOTO_TYPES[type];
      if (!ext || bytes.byteLength > (folder === "audio" ? AUDIO_MAX_BYTES : PHOTO_MAX_BYTES)) throw new Error("Invalid media file.");
      const destination = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await admin.storage.from(BUCKET).upload(destination, bytes, { contentType: type, upsert: false });
      if (error) throw new Error("Media upload failed.");
      return destination;
    };
    try {
      const audioPath = await upload(data.audioName, data.audioType, form.get("audioData") as string | undefined, "audio");
      const photoPath = await upload(data.photoName, data.photoType, form.get("photoData") as string | undefined, "photos");
      const { error } = await supabaseAdmin.from("testimonies").insert({
        full_name: data.fullName, email: data.email, location: data.location || null,
        title: data.title, testimony: data.testimony || null, story: "", category: data.category || null,
        consent: true, consent_to_publish: true, status: "pending", audio_url: audioPath, image_url: photoPath,
      });
      if (error) throw new Error("Testimony save failed.");
      void notifyModerators(data.title);
      return { ok: true, message: "Thank you. Your testimony has been received for review; submission does not guarantee publication." };
    } catch {
      return { ok: false, message: "We could not receive your testimony. Please try again." };
    }
  });

async function notifyModerators(title: string) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env["RESEND_FROM"] ?? "website@seedofchrist.org", to: ["admin@seedofchrist.org"], subject: "New testimony awaiting review", text: `A new testimony ("${title.slice(0, 160)}") is waiting for review.` }),
    });
  } catch { /* optional notification */ }
}

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
