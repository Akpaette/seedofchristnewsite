import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const TESTIMONY_CATEGORIES = [
  "Healing",
  "Deliverance",
  "Salvation",
  "Answered Prayer",
  "Provision",
  "Restoration",
  "Family",
  "Career / Business",
  "Other",
] as const;

const submitSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(120).optional(),
  title: z.string().trim().min(3, "Please add a testimony title.").max(160),
  story: z.string().trim().min(20, "Please share at least 20 characters.").max(6000),
  category: z.enum(TESTIMONY_CATEGORIES).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Publication consent is required." }) }),
  website: z.string().max(0).optional(),
});

const listSchema = z.object({ limit: z.number().int().min(1).max(50).default(24) });
const idSchema = z.object({ id: z.string().uuid() });

export type PublicTestimony = {
  id: string;
  full_name: string;
  location: string | null;
  title: string;
  story: string;
  category: string | null;
  published_at: string;
  image_url: string | null;
  video_url: string | null;
};

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("The testimony service is unavailable.");

  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const submitTestimony = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    const client = publicClient();
    const { error } = await client.from("testimonies").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      location: data.location || null,
      title: data.title,
      story: data.story,
      category: data.category || null,
      consent: true,
    });

    if (error) {
      console.error("Testimony submission failed", error.code);
      return { ok: false, message: "We could not receive your testimony. Please try again." };
    }
    return {
      ok: true,
      message: "Thank you. Your testimony has been received for review; submission does not guarantee publication.",
    };
  });

export const getPublishedTestimonies = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => listSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    const { data: rows, error } = await publicClient()
      .from("testimonies")
      .select("id, full_name, location, title, story, category, published_at, image_url, video_url")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(data.limit);

    if (error) throw new Error("Published testimonies could not be loaded.");
    return (rows ?? []).filter((row): row is PublicTestimony => Boolean(row.published_at));
  });

export const getPublishedTestimony = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("testimonies")
      .select("id, full_name, location, title, story, category, published_at, image_url, video_url")
      .eq("id", data.id)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error("This testimony could not be loaded.");
    return row?.published_at ? (row as PublicTestimony) : null;
  });