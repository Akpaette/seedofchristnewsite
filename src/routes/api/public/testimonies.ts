import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import {
  AUDIO_MAX_BYTES,
  AUDIO_TYPES,
  PHOTO_MAX_BYTES,
  PHOTO_TYPES,
  TESTIMONY_CATEGORIES,
} from "@/lib/testimony-rules";

const BUCKET = "testimony-media";

const submissionSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  location: z.string().trim().max(120).optional(),
  title: z.string().trim().min(3).max(160),
  testimony: z.string().trim().max(6000).optional(),
  category: z.enum(TESTIMONY_CATEGORIES).optional(),
  consent: z.literal("true"),
  website: z.string().max(0).optional(),
});

function hasSignature(file: File, bytes: Uint8Array) {
  const starts = (...signature: number[]) => signature.every((value, index) => bytes[index] === value);
  switch (file.type) {
    case "image/jpeg": return starts(0xff, 0xd8, 0xff);
    case "image/png": return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case "image/webp": return starts(0x52, 0x49, 0x46, 0x46) && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
    case "audio/mpeg": return starts(0x49, 0x44, 0x33) || (bytes[0] === 0xff && (bytes[1]! & 0xe0) === 0xe0);
    case "audio/mp4":
    case "audio/x-m4a": return String.fromCharCode(...bytes.slice(4, 8)) === "ftyp";
    case "audio/aac": return starts(0xff) && (bytes[1]! & 0xf6) === 0xf0;
    case "audio/wav":
    case "audio/x-wav": return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WAVE";
    case "audio/ogg": return String.fromCharCode(...bytes.slice(0, 4)) === "OggS";
    case "audio/webm": return starts(0x1a, 0x45, 0xdf, 0xa3);
    default: return false;
  }
}

async function hashIp(ip: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`testimony:${ip}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function submit(request: Request) {
  const form = await request.formData();
  const rawText = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" && value.trim() ? value : undefined;
  };
  const payload = submissionSchema.parse({
    fullName: rawText("fullName") ?? "",
    email: rawText("email") ?? "",
    location: rawText("location"),
    title: rawText("title") ?? "",
    testimony: rawText("testimony"),
    category: rawText("category"),
    consent: rawText("consent") ?? "false",
    website: rawText("website"),
  });

  const optionalFile = (key: string) => {
    const value = form.get(key);
    return value instanceof File && value.size > 0 ? value : undefined;
  };
  const audio = optionalFile("audio");
  const photo = optionalFile("photo");
  if ((!payload.testimony || payload.testimony.length < 20) && !audio && !photo) {
    return Response.json({ ok: false, message: "Please write a testimony or attach audio or photo evidence." }, { status: 400 });
  }
  if (audio && (!AUDIO_TYPES[audio.type] || audio.size > AUDIO_MAX_BYTES || !audio.name.toLowerCase().endsWith(`.${AUDIO_TYPES[audio.type]}`))) {
    return Response.json({ ok: false, message: "Audio must be MP3, M4A, AAC, WAV, OGG or WebM and under 10 MB." }, { status: 400 });
  }
  if (photo && (!PHOTO_TYPES[photo.type] || photo.size > PHOTO_MAX_BYTES || !/\.(jpe?g|png|webp)$/i.test(photo.name))) {
    return Response.json({ ok: false, message: "Photo must be JPEG, PNG or WebP and under 5 MB." }, { status: 400 });
  }

  const files = [audio, photo].filter((entry): entry is File => Boolean(entry));
  for (const item of files) {
    const signature = new Uint8Array(await item.slice(0, 16).arrayBuffer());
    if (!hasSignature(item, signature)) {
      return Response.json({ ok: false, message: "One of the selected files is not a valid audio or photo file." }, { status: 400 });
    }
  }
  if (payload.website) return Response.json({ ok: true, message: "Thank you. Your testimony has been received for review; submission does not guarantee publication." });

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const trustedIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-nf-client-connection-ip") ?? "unknown";
  const ipHash = await hashIp(trustedIp);
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateError } = await supabaseAdmin
    .from("submission_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (rateError) throw new Error("Submission service unavailable");
  if ((count ?? 0) >= 5) return Response.json({ ok: false, message: "Too many submissions from this connection. Please try again in an hour." }, { status: 429 });
  const { error: attemptError } = await supabaseAdmin.from("submission_attempts").insert({ ip_hash: ipHash });
  if (attemptError) throw new Error("Submission service unavailable");

  const uploaded: string[] = [];
  const upload = async (item: File, folder: "audio" | "photos", extension: string) => {
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, await item.arrayBuffer(), { contentType: item.type, upsert: false });
    if (error) throw new Error("Media upload failed");
    uploaded.push(path);
    return path;
  };

  try {
    const audioPath = audio ? await upload(audio, "audio", AUDIO_TYPES[audio.type]!) : null;
    const photoPath = photo ? await upload(photo, "photos", PHOTO_TYPES[photo.type]!) : null;
    const { error } = await supabaseAdmin.from("testimonies").insert({
      full_name: payload.fullName,
      email: payload.email,
      location: payload.location || null,
      title: payload.title,
      testimony: payload.testimony || null,
      story: "",
      category: payload.category || null,
      consent: true,
      consent_to_publish: true,
      status: "pending",
      audio_url: audioPath,
      image_url: photoPath,
    });
    if (error) throw new Error("Testimony save failed");
  } catch (error) {
    console.error("Testimony submission failed", error instanceof Error ? error.message : "unknown");
    if (uploaded.length) await supabaseAdmin.storage.from(BUCKET).remove(uploaded);
    throw new Error("We could not receive your testimony. Please try again.");
  }

  void notifyModerators(payload.title);
  return Response.json({ ok: true, message: "Thank you. Your testimony has been received for review; submission does not guarantee publication." });
}

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
    /* Email notification is optional. */
  }
}

export const Route = createFileRoute("/api/public/testimonies")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          return await submit(request);
        } catch (error) {
          const message = error instanceof z.ZodError ? error.issues[0]?.message ?? "Please check your submission." : error instanceof Error && error.message.startsWith("We could not") ? error.message : "We could not receive your testimony. Please try again.";
          const status = error instanceof z.ZodError ? 400 : 500;
          return Response.json({ ok: false, message }, { status });
        }
      },
    },
  },
});