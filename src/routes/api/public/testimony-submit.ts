import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TESTIMONY_CATEGORIES } from "@/lib/testimony-rules";

const AUDIO_LIMIT = 10 * 1024 * 1024;
const PHOTO_LIMIT = 5 * 1024 * 1024;
const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3", "audio/mp4": "m4a", "audio/x-m4a": "m4a", "audio/aac": "aac",
  "audio/wav": "wav", "audio/x-wav": "wav", "audio/ogg": "ogg", "audio/webm": "webm",
};
const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  location: z.string().trim().max(120).optional(),
  title: z.string().trim().min(3).max(160),
  testimony: z.string().trim().max(6000).optional(),
  category: z.enum(TESTIMONY_CATEGORIES).optional(),
  consent: z.literal("true"),
  website: z.string().max(0).optional(),
});

function validSignature(file: File, bytes: Uint8Array) {
  const starts = (...signature: number[]) => signature.every((value, index) => bytes[index] === value);
  switch (file.type) {
    case "image/jpeg": return starts(0xff, 0xd8, 0xff);
    case "image/png": return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case "image/webp": return starts(0x52, 0x49, 0x46, 0x46) && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
    case "audio/mpeg": return starts(0x49, 0x44, 0x33) || (bytes[0] === 0xff && (bytes[1]! & 0xe0) === 0xe0);
    case "audio/mp4": case "audio/x-m4a": return String.fromCharCode(...bytes.slice(4, 8)) === "ftyp";
    case "audio/aac": return starts(0xff) && (bytes[1]! & 0xf6) === 0xf0;
    case "audio/wav": case "audio/x-wav": return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WAVE";
    case "audio/ogg": return String.fromCharCode(...bytes.slice(0, 4)) === "OggS";
    case "audio/webm": return starts(0x1a, 0x45, 0xdf, 0xa3);
    default: return false;
  }
}

async function ipHash(ip: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`testimony:${ip}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sendNotification(title: string) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env["RESEND_FROM"] ?? "website@seedofchrist.org", to: ["testimonies@seedofchrist.org"], subject: "New testimony awaiting review", text: `A new testimony ("${title.slice(0, 160)}") is waiting for review.` }),
    });
  } catch { /* Notification is optional. */ }
}

async function handle(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > AUDIO_LIMIT + PHOTO_LIMIT + 1_000_000) return Response.json({ ok: false, message: "The selected files exceed the upload limit." }, { status: 413 });

  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-nf-client-connection-ip") ?? "unknown";
  const hashedIp = await ipHash(ip);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateError } = await supabaseAdmin.from("submission_attempts")
    .select("id", { count: "exact", head: true }).eq("ip_hash", hashedIp).gte("created_at", since);
  if (rateError) throw new Error("Submission service unavailable");
  if ((count ?? 0) >= 5) return Response.json({ ok: false, message: "Too many submissions from this connection. Please try again in an hour." }, { status: 429 });

  const form = await request.formData();
  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" && value.trim() ? value : undefined;
  };
  const payload = schema.parse({
    fullName: text("fullName") ?? "", email: text("email") ?? "", location: text("location"),
    title: text("title") ?? "", testimony: text("testimony"), category: text("category"),
    consent: text("consent") ?? "false", website: text("website"),
  });
  const asFile = (key: string) => {
    const value = form.get(key);
    return value instanceof File && value.size > 0 ? value : undefined;
  };
  const audio = asFile("audio");
  const photo = asFile("photo");
  if (payload.website) return Response.json({ ok: true, message: "Thank you. Your testimony has been received for review; submission does not guarantee publication." });
  if ((!payload.testimony || payload.testimony.length < 20) && !audio && !photo) {
    return Response.json({ ok: false, message: "Please write at least 20 characters or attach audio or photo evidence." }, { status: 400 });
  }
  if (audio && (!AUDIO_TYPES[audio.type] || audio.size > AUDIO_LIMIT || !audio.name.toLowerCase().endsWith(`.${AUDIO_TYPES[audio.type]}`))) {
    return Response.json({ ok: false, message: "Audio must be MP3, M4A, AAC, WAV, OGG or WebM and under 10 MB." }, { status: 400 });
  }
  if (photo && (!PHOTO_TYPES[photo.type] || photo.size > PHOTO_LIMIT || !/\.(jpe?g|png|webp)$/i.test(photo.name))) {
    return Response.json({ ok: false, message: "Photo must be JPEG, PNG or WebP and under 5 MB." }, { status: 400 });
  }
  for (const file of [audio, photo].filter((entry): entry is File => Boolean(entry))) {
    if (!validSignature(file, new Uint8Array(await file.slice(0, 16).arrayBuffer()))) {
      return Response.json({ ok: false, message: "One of the selected files is not a supported audio or photo file." }, { status: 400 });
    }
  }
  if (payload.website) return Response.json({ ok: true, message: "Thank you. Your testimony has been received for review; submission does not guarantee publication." });

  const { error: attemptError } = await supabaseAdmin.from("submission_attempts").insert({ ip_hash: hashedIp });
  if (attemptError) throw new Error("Submission service unavailable");
  const savedFiles: string[] = [];
  const upload = async (file: File | undefined, folder: "audio" | "photos", types: Record<string, string>) => {
    if (!file) return null;
    const path = `${folder}/${crypto.randomUUID()}.${types[file.type]}`;
    const { error } = await supabaseAdmin.storage.from("testimony-media").upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (error) throw new Error("Media upload failed");
    savedFiles.push(path);
    return path;
  };
  try {
    const audioPath = await upload(audio, "audio", AUDIO_TYPES);
    const imagePath = await upload(photo, "photos", PHOTO_TYPES);
    const { error } = await supabaseAdmin.from("testimonies").insert({
      full_name: payload.fullName, email: payload.email, location: payload.location || null,
      title: payload.title, testimony: payload.testimony || null, story: "", category: payload.category || null,
      consent: true, consent_to_publish: true, status: "pending", audio_url: audioPath, image_url: imagePath,
    });
    if (error) throw new Error("Testimony save failed");
    void sendNotification(payload.title);
    return Response.json({ ok: true, message: "Thank you. Your testimony has been received for review; submission does not guarantee publication." });
  } catch (error) {
    console.error("Testimony submission failed", error instanceof Error ? error.message : "unknown");
    if (savedFiles.length) await supabaseAdmin.storage.from("testimony-media").remove(savedFiles);
    return Response.json({ ok: false, message: "We could not receive your testimony. Please try again." }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/testimony-submit")({
  server: { handlers: { POST: async ({ request }) => {
    try {
      return await handle(request);
    } catch (error) {
      const message = error instanceof z.ZodError ? error.issues[0]?.message ?? "Please check your submission." : "We could not receive your testimony. Please try again.";
      return Response.json({ ok: false, message }, { status: error instanceof z.ZodError ? 400 : 500 });
    }
  } } },
});