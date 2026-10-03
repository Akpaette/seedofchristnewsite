import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Send, Video } from "lucide-react";
import { AppBadges, DeviceAwareAppButton } from "@/components/site/AppBadges";
import { SocialLinks } from "@/components/site/SocialLinks";
import { Btn, Display, Label, SectionHead, inputClass } from "@/components/site/ui";
import {
  getPublishedTestimonies,
  submitTestimony,
  TESTIMONY_CATEGORIES,
} from "@/lib/testimonies.functions";

const TITLE = "Testimonies | Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Share a testimony for church review and read published testimonies from Seed of Christ Golden Church Worldwide.";

export const Route = createFileRoute("/testimonies")({
  loader: () => getPublishedTestimonies({ data: { limit: 24 } }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/testimonies" }],
  }),
  component: TestimoniesPage,
});

function TestimoniesPage() {
  const published = Route.useLoaderData();
  const submit = useServerFn(submitTestimony);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return published.filter((item) => {
      const matchesCategory = !category || item.category === category;
      const matchesSearch =
        !normalized ||
        [item.title, item.story, item.full_name, item.location]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalized));
      return matchesCategory && matchesSearch;
    });
  }, [category, published, query]);

  return (
    <main>
      <section className="bg-ink px-5 py-20 text-porcelain md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Label dark>God&apos;s faithfulness, shared</Label>
          <Display as="h1" className="max-w-4xl text-5xl sm:text-6xl md:text-8xl" color="var(--color-porcelain)">
            TESTIMONIES
          </Display>
          <p className="mt-6 max-w-2xl text-base leading-8 text-paper/75 md:text-lg">
            Share what God has done and read testimonies that have been reviewed for publication by the church.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="published-heading">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Published by the church" title="READ TESTIMONIES" />

          {published.length > 0 && (
            <div className="mb-9 grid gap-3 md:grid-cols-[1fr_260px]">
              <label className="relative block">
                <span className="sr-only">Search published testimonies</span>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={17} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search testimonies"
                  className={`${inputClass} pl-11`}
                />
              </label>
              <label>
                <span className="sr-only">Filter testimonies by category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass}>
                  <option value="">All categories</option>
                  {TESTIMONY_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          )}

          {published.length === 0 ? (
            <div className="border-y border-line py-14 text-center">
              <Display as="h2" className="text-3xl">THE ARCHIVE IS BEING PREPARED</Display>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-70">
                No testimonies have been published here yet. Every submission is reviewed before it appears publicly.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <p role="status" className="border-y border-line py-10 text-center">No published testimonies match your search.</p>
          ) : (
            <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <article key={item.id} className="flex min-h-72 flex-col bg-porcelain p-6 md:p-8">
                  <div className="font-label text-[0.68rem] font-semibold uppercase text-golddeep">
                    {item.category ?? "Testimony"} · {formatDate(item.published_at)}
                  </div>
                  <Display as="h2" className="mt-5 text-2xl md:text-3xl">{item.title.toUpperCase()}</Display>
                  <p className="mt-4 line-clamp-4 text-sm leading-7 opacity-70">{item.story}</p>
                  <p className="mt-5 text-sm font-semibold">{item.full_name}{item.location ? ` · ${item.location}` : ""}</p>
                  <Link
                    to="/testimonies/$id"
                    params={{ id: item.id }}
                    className="font-label mt-auto inline-flex min-h-11 items-end gap-2 pt-6 text-xs font-bold uppercase text-golddeep"
                  >
                    Read testimony <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-porcelain md:px-8 md:py-28" aria-labelledby="submit-heading">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <Label dark>Tell of His goodness</Label>
            <Display as="h2" className="text-4xl md:text-6xl" color="var(--color-porcelain)">
              <span id="submit-heading">SHARE YOUR TESTIMONY</span>
            </Display>
            <p className="mt-5 max-w-md text-sm leading-7 text-paper/70">
              Your submission goes to the church for review and will not appear publicly unless approved and published.
            </p>
            <p className="mt-4 text-sm text-paper/55">Media uploads are not accepted here yet. This keeps personal files secure while the church prepares a reviewed media process.</p>
          </div>

          <form className="space-y-5" onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            setBusy(true);
            setResult(null);
            try {
              const response = await submit({ data: {
                fullName: String(data.get("fullName") ?? ""),
                email: String(data.get("email") ?? ""),
                phone: String(data.get("phone") ?? ""),
                location: String(data.get("location") ?? ""),
                title: String(data.get("title") ?? ""),
                story: String(data.get("story") ?? ""),
                category: String(data.get("category") || "") || undefined,
                consent: data.get("consent") === "on",
                website: String(data.get("website") ?? ""),
              } });
              setResult(response);
              if (response.ok) form.reset();
            } catch (error) {
              const message = error instanceof Error ? error.message : "Please review the form and try again.";
              setResult({ ok: false, message });
            } finally { setBusy(false); }
          }}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" id="fullName" required><input id="fullName" name="fullName" required minLength={2} maxLength={120} autoComplete="name" className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field>
              <Field label="Email address" id="email" required><input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field>
              <Field label="Phone number (optional)" id="phone"><input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field>
              <Field label="Location / city (optional)" id="location"><input id="location" name="location" maxLength={120} autoComplete="address-level2" className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field>
            </div>
            <Field label="Testimony title" id="title" required><input id="title" name="title" required minLength={3} maxLength={160} className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field>
            <Field label="Category (optional)" id="category"><select id="category" name="category" className={`${inputClass} mt-1 border-porcelain/30 bg-ink text-porcelain`}><option value="">Choose a category</option>{TESTIMONY_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="Your testimony" id="story" required><textarea id="story" name="story" required minLength={20} maxLength={6000} rows={9} className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field>
            <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-paper/80">
              <input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-gold" />
              <span>I give Seed of Christ Golden Church permission to review and, where appropriate, publish my testimony on its website, social media platforms and other official ministry channels. I understand that submission does not guarantee publication.</span>
            </label>
            <Btn type="submit" icon={Send} disabled={busy}>{busy ? "Submitting…" : "Submit for review"}</Btn>
            {result && <p role="status" aria-live="polite" className={`border p-4 text-sm ${result.ok ? "border-gold text-paper" : "border-crimson text-porcelain"}`}>{result.message}</p>}
          </form>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div><Video className="text-golddeep" size={25} aria-hidden="true" /><SectionHead label="Video & live testimonies" title="WATCH TESTIMONIES" sub="Approved video and live testimony content is available through the official Church App." /><DeviceAwareAppButton tone="ghostDark">Watch More Testimonies on the Church App</DeviceAwareAppButton><AppBadges className="mt-5" /></div>
          <div className="bg-ink p-7 text-porcelain md:p-10"><Label dark>Stay connected</Label><Display as="h2" className="text-3xl" color="var(--color-porcelain)">FOLLOW THE MINISTRY</Display><p className="mb-6 mt-3 text-sm leading-7 text-paper/65">Connect with the church&apos;s official social channels.</p><SocialLinks showLabels /></div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, id, required = false, children }: { label: string; id: string; required?: boolean; children: React.ReactNode }) {
  return <div><label className="font-label text-xs font-bold uppercase text-paper" htmlFor={id}>{label}{required && <span className="text-gold"> *</span>}</label>{children}</div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}