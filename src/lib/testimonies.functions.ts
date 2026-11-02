import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { TESTIMONY_CATEGORIES } from "./testimony-rules";

export { TESTIMONY_CATEGORIES } from "./testimony-rules";

const BUCKET = "testimony-media";
const PAGE_SIZE = 12;
const PUBLIC_COLUMNS = "id, full_name, location, title, testimony, story, category, published_at, image_url, audio_url";

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

type TestimonyRow = {
  id: string; full_name: string; location: string | null; title: string; testimony: string | null;
  story: string; category: string | null; published_at: string | null; image_url: string | null; audio_url: string | null;
};

function publicClient() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("The testimony service is unavailable.");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
}

async function signedPaths(rows: TestimonyRow[], lifetime: number) {
  const paths = [...new Set(rows.flatMap((row) => [row.image_url, row.audio_url]).filter((path): path is string => Boolean(path)))];
  const result = new Map<string, string>();
  if (!paths.length) return result;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrls(paths, lifetime);
  for (const item of data ?? []) {
    if (!item.path || !item.signedUrl) continue;
    const browserUrl = process.env["VITE_SUPABASE_URL"];
    if (!browserUrl) continue;
    const signed = new URL(item.signedUrl);
    const base = new URL(browserUrl);
    signed.host = base.host;
    signed.protocol = base.protocol;
    result.set(item.path, signed.toString());
  }
  return result;
}

async function toPublic(rows: TestimonyRow[]): Promise<PublicTestimony[]> {
  const urls = await signedPaths(rows, 60 * 60);
  return rows.flatMap((row) => row.published_at ? [{
    id: row.id,
    full_name: row.full_name,
    location: row.location,
    title: row.title,
    testimony: row.testimony ?? row.story ?? "",
    category: row.category,
    published_at: row.published_at,
    image_url: row.image_url ? urls.get(row.image_url) ?? null : null,
    audio_url: row.audio_url ? urls.get(row.audio_url) ?? null : null,
  }] : []);
}

export const getPublishedTestimonies = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ page: z.number().int().min(1).max(500).default(1) }).parse(input ?? {}))
  .handler(async ({ data }) => {
    const start = (data.page - 1) * PAGE_SIZE;
    const { data: rows, error, count } = await publicClient().from("testimonies")
      .select(PUBLIC_COLUMNS, { count: "exact" })
      .eq("status", "approved")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .range(start, start + PAGE_SIZE - 1);
    if (error) throw new Error("Published testimonies could not be loaded.");
    return { items: await toPublic((rows ?? []) as TestimonyRow[]), page: data.page, total: count ?? 0, totalPages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)) };
  });

const MAX_AUDIO = 10 * 1024 * 1024;
const MAX_PHOTO = 5 * 1024 * 1024;
const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3", "audio/mp4": "m4a", "audio/x-m4a": "m4a", "audio/aac": "aac",
  "audio/wav": "wav", "audio/x-wav": "wav", "audio/ogg": "ogg", "audio/webm": "webm",
};
const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const inputSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  location: z.string().trim().max(120).optional(),
  title: z.string().trim().min(3).max(160),
  testimony: z.string().trim().max(6000).optional(),
  category: z.enum(TESTIMONY_CATEGORIES).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  audioData: z.string().optional(),
  audioType: z.string().optional(),
  audioName: z.string().optional(),
  photoData: z.string().optional(),
  photoType: z.string().optional(),
  photoName: z.string().optional(),
});

export const submitTestimony = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const data = inputSchema.parse(input);
    const audioBytes = data.audioData ? Math.floor((data.audioData.length * 3) / 4) : 0;
    const photoBytes = data.photoData ? Math.floor((data.photoData.length * 3) / 4) : 0;
    if (audioBytes > MAX_AUDIO || (data.audioData && (!data.audioType || !AUDIO_TYPES[data.audioType] || !data.audioName?.toLowerCase().endsWith(`.${AUDIO_TYPES[data.audioType]}`)))) throw new Error("Audio must be MP3, M4A, AAC, WAV, OGG or WebM and under 10 MB.");
    if (photoBytes > MAX_PHOTO || (data.photoData && (!data.photoType || !PHOTO_TYPES[data.photoType] || !/\.(jpe?g|png|webp)$/i.test(data.photoName ?? "")))) throw new Error("Photo must be JPEG, PNG or WebP and under 5 MB.");
    if ((!data.testimony || data.testimony.length < 20) && !data.audioData && !data.photoData) throw new Error("Please write at least 20 characters or attach audio or photo evidence.");
    return data;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-nf-client-connection-ip") || "unknown";
    const ipDigest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`testimony:${ip}`));
    const ipHash = Array.from(new Uint8Array(ipDigest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin.from("submission_attempts").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if (countError) throw new Error("Submission service unavailable.");
    if ((count ?? 0) >= 5) return { ok: false, message: "Too many submissions from this connection. Please try again in an hour." };
    const { error: recordError } = await supabaseAdmin.from("submission_attempts").insert({ ip_hash: ipHash });
    if (recordError) throw new Error("Submission service unavailable.");

    const uploaded: string[] = [];
    const upload = async (base64: string | undefined, mime: string | undefined, types: Record<string, string>, folder: "audio" | "photos") => {
      if (!base64 || !mime) return null;
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const ext = types[mime];
      const objectPath = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabaseAdmin.storage.from(BUCKET).upload(objectPath, bytes, { contentType: mime, upsert: false });
      if (error) throw new Error("Media upload failed.");
      uploaded.push(objectPath);
      return objectPath;
    };
    try {
      const audioPath = await upload(data.audioData, data.audioType, AUDIO_TYPES, "audio");
      const photoPath = await upload(data.photoData, data.photoType, PHOTO_TYPES, "photos");
      const { error } = await supabaseAdmin.from("testimonies").insert({
        full_name: data.fullName, email: data.email, location: data.location || null, title: data.title,
        testimony: data.testimony || null, story: "", category: data.category || null,
        consent: true, consent_to_publish: true, status: "pending", audio_url: audioPath, image_url: photoPath,
      });
      if (error) throw new Error("Testimony save failed.");
      void notifyAdmin(data.title);
      return { ok: true, message: "Thank you. Your testimony has been received for review; submission does not guarantee publication." };
    } catch (error) {
      console.error("Testimony submission failed", error instanceof Error ? error.message : "unknown");
      if (uploaded.length) await supabaseAdmin.storage.from(BUCKET).remove(uploaded);
      return { ok: false, message: "We could not receive your testimony. Please try again." };
    }
  });

async function notifyAdmin(title: string) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env["RESEND_FROM"] ?? "website@seedofchrist.org", to: ["admin@seedofchrist.org"], subject: "New testimony awaiting review", text: `A new testimony ("${title.slice(0, 160)}") is waiting for review.` }),
    });
  } catch { /* Optional notification. */ }
}

export const getPublishedTestimony = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient().from("testimonies")
      .select(PUBLIC_COLUMNS).eq("id", data.id).eq("status", "approved").not("published_at", "is", null).maybeSingle();
    if (error) throw new Error("This testimony could not be loaded.");
    return row ? (await toPublic([row as TestimonyRow]))[0] ?? null : null;
  });

export const STATUSES = ["pending", "approved", "rejected", "archived"] as const;

export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (error) throw new Error("Could not verify administrator access.");
    return { isAdmin: Boolean(data) };
  });

export const listForModeration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ status: z.enum(STATUSES) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.from("testimonies")
      .select("id, full_name, email, location, title, testimony, story, category, status, rejection_reason, submitted_at, reviewed_at, published_at, image_url, audio_url")
      .eq("status", data.status).order("submitted_at", { ascending: false }).limit(100);
    if (error) throw new Error("Could not load testimonies.");
    const urls = await signedPaths((rows ?? []) as TestimonyRow[], 15 * 60);
    return (rows ?? []).map((row) => ({
      ...row,
      testimony: row.testimony ?? row.story,
      image_signed: row.image_url ? urls.get(row.image_url) ?? null : null,
      audio_signed: row.audio_url ? urls.get(row.audio_url) ?? null : null,
    }));
  });

export const moderateTestimony = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), action: z.enum(["approve", "reject", "archive"]), reason: z.string().trim().max(1000).optional() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    const update = data.action === "approve"
      ? { status: "approved", published_at: now, reviewed_at: now, reviewed_by: context.userId, rejection_reason: null }
      : data.action === "reject"
        ? { status: "rejected", published_at: null, reviewed_at: now, reviewed_by: context.userId, rejection_reason: data.reason || null }
        : { status: "archived", published_at: null, reviewed_at: now, reviewed_by: context.userId };
    const { error } = await supabaseAdmin.from("testimonies").update(update).eq("id", data.id);
    if (error) throw new Error("Could not update this testimony.");
    return { ok: true };
  });