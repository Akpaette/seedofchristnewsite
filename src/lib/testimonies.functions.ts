import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { TESTIMONY_CATEGORIES } from "./testimony-rules";

export { TESTIMONY_CATEGORIES } from "./testimony-rules";

const BUCKET = "testimony-media";
const PAGE_SIZE = 12;
const PUBLIC_COLUMNS = "id, full_name, location, title, testimony, category, published_at, image_url, audio_url";

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
  category: string | null; published_at: string | null; image_url: string | null; audio_url: string | null;
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
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUrls(paths, lifetime);
    if (error) throw error;
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
  } catch {
    console.error("Unable to create signed testimony media links.");
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
    testimony: row.testimony ?? "",
    category: row.category,
    published_at: row.published_at,
    image_url: row.image_url ? urls.get(row.image_url) ?? null : null,
    audio_url: row.audio_url ? urls.get(row.audio_url) ?? null : null,
  }] : []);
}

export const getPublishedTestimonies = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({
    page: z.number().int().min(1).max(500).default(1),
    search: z.string().trim().max(100).optional(),
    category: z.enum(TESTIMONY_CATEGORIES).optional(),
  }).parse(input ?? {}))
  .handler(async ({ data }) => {
    try {
      const start = (data.page - 1) * PAGE_SIZE;
      const search = data.search?.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
      let query = publicClient().from("testimonies")
        .select(PUBLIC_COLUMNS, { count: "exact" })
        .eq("status", "approved")
        .not("published_at", "is", null);
      if (data.category) query = query.eq("category", data.category);
      if (search) query = query.or(`title.ilike.%${search}%,testimony.ilike.%${search}%,full_name.ilike.%${search}%,location.ilike.%${search}%`);
      const { data: rows, error, count } = await query
        .order("published_at", { ascending: false })
        .range(start, start + PAGE_SIZE - 1);
      if (error) {
        console.error("Could not load public testimonies.");
        return { items: [], page: data.page, total: 0, totalPages: 1, error: "Published testimonies are temporarily unavailable." };
      }
      return { items: await toPublic((rows ?? []) as TestimonyRow[]), page: data.page, total: count ?? 0, totalPages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)), error: null as string | null };
    } catch {
      console.error("Could not connect to the public testimony service.");
      return { items: [], page: data.page, total: 0, totalPages: 1, error: "Published testimonies are temporarily unavailable." };
    }
  });

export const getPublishedTestimony = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient().from("testimonies")
      .select(PUBLIC_COLUMNS).eq("id", data.id).eq("status", "approved").not("published_at", "is", null).maybeSingle();
    if (error) throw new Error("This testimony could not be loaded.");
    return row ? (await toPublic([row as TestimonyRow]))[0] ?? null : null;
  });

export const STATUSES = ["pending", "approved", "rejected", "archived"] as const;

export const recordEmailedTestimony = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    location: z.string().trim().max(120).optional(),
    title: z.string().trim().min(3).max(160),
    testimony: z.string().trim().min(20).max(6000),
    category: z.enum(TESTIMONY_CATEGORIES).optional(),
    consentConfirmed: z.boolean(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleError || !isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("testimonies").insert({
      full_name: data.fullName,
      email: data.email,
      location: data.location || null,
      title: data.title,
      testimony: data.testimony,
      story: "",
      category: data.category || null,
      consent: true,
      consent_to_publish: data.consentConfirmed,
      status: "pending",
    });
    if (error) throw new Error("Could not add this emailed testimony for review.");
    return { ok: true };
  });

export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (error) throw new Error("Could not verify administrator access.");
    return { isAdmin: Boolean(data) };
  });

export const listForModeration = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ status: z.enum(STATUSES) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.from("testimonies")
      .select("id, full_name, email, location, title, testimony, category, status, rejection_reason, submitted_at, reviewed_at, published_at, image_url, audio_url, consent_to_publish")
      .eq("status", data.status).order("submitted_at", { ascending: false }).limit(100);
    if (error) throw new Error("Could not load testimonies.");
    const urls = await signedPaths((rows ?? []) as TestimonyRow[], 15 * 60);
    return (rows ?? []).map((row) => ({
      ...row,
      testimony: row.testimony ?? "",
      image_signed: row.image_url ? urls.get(row.image_url) ?? null : null,
      audio_signed: row.audio_url ? urls.get(row.audio_url) ?? null : null,
    }));
  });

export const moderateTestimony = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), action: z.enum(["approve", "reject", "archive"]), reason: z.string().trim().max(1000).optional() }).superRefine((value, context) => {
    if (value.action === "reject" && !value.reason) context.addIssue({ code: "custom", message: "A rejection reason is required.", path: ["reason"] });
  }).parse(input))
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
    if (data.action === "approve") {
      const { data: updated, error } = await supabaseAdmin.from("testimonies").update(update)
        .eq("id", data.id).eq("consent_to_publish", true).select("id").maybeSingle();
      if (error || !updated) throw new Error("This testimony needs confirmed consent before publication.");
    } else {
      const { error } = await supabaseAdmin.from("testimonies").update(update).eq("id", data.id);
      if (error) throw new Error("Could not update this testimony.");
    }
    return { ok: true };
  });