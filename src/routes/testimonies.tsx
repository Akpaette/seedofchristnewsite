import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Mail, Search, Send, Volume2 } from "lucide-react";
import { AppBadges, DeviceAwareAppButton } from "@/components/site/AppBadges";
import { SocialLinks } from "@/components/site/SocialLinks";
import { Btn, Display, Label, SectionHead, inputClass } from "@/components/site/ui";
import { getPublishedTestimonies, TESTIMONY_CATEGORIES } from "@/lib/testimonies.functions";
import { AUDIO_ACCEPT, AUDIO_MAX_BYTES, PHOTO_ACCEPT, PHOTO_MAX_BYTES, sanitizePhoto } from "@/lib/testimony-rules";

const TITLE = "Testimonies | Seed of Christ Golden Church Worldwide";
const DESCRIPTION = "Share a written or audio testimony with Seed of Christ Golden Church Worldwide, or read reviewed testimonies from the church.";

export const Route = createFileRoute("/testimonies")({
  loader: () => getPublishedTestimonies({ data: { page: 1 } }),
  head: () => ({ meta: [
    { title: TITLE }, { name: "description", content: DESCRIPTION },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/testimonies" }] }),
  component: TestimoniesPage,
});

function TestimoniesPage() {
  const archive = Route.useLoaderData();
  const [archiveData, setArchiveData] = useState(archive);
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [archiveError, setArchiveError] = useState(archive.error ?? "");
  const [audio, setAudio] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");
  useEffect(() => {
    if (!audio) { setAudioPreview(""); return; }
    const url = URL.createObjectURL(audio);
    setAudioPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [audio]);
  const filtered = useMemo(() => archiveData.items, [archiveData.items]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void getPublishedTestimonies({ data: { page, search: query.trim() || undefined, category: category || undefined } })
        .then((result) => {
          if (!active) return;
          setArchiveData(result);
          setArchiveError(result.error ?? "");
        })
        .catch(() => {
          if (active) setArchiveError("Published testimonies are temporarily unavailable.");
        });
    }, query.trim() ? 250 : 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [category, page, query]);

  const handlePhoto = async (file: File | undefined) => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview("");
    if (!file) return;
    if (!PHOTO_ACCEPT.split(",").includes(file.name.slice(file.name.lastIndexOf(".")).toLowerCase()) || file.size > PHOTO_MAX_BYTES) {
      setResult({ ok: false, message: "Choose a JPEG, PNG or WebP photo under 5 MB." });
      return;
    }
    try {
      const cleaned = await sanitizePhoto(file);
      if (cleaned.size > PHOTO_MAX_BYTES) throw new Error("The processed image is larger than 5 MB.");
      setPhoto(cleaned);
      setPhotoPreview(URL.createObjectURL(cleaned));
    } catch (error) {
      setResult({ ok: false, message: error instanceof Error ? error.message : "This photo could not be processed." });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    const form = formRef.current;
    const values = new FormData(form);
    values.delete("audio");
    values.delete("photo");
    if (audio) values.set("audio", audio);
    if (photo) values.set("photo", photo);
    values.set("consent", values.get("consent") === "on" ? "true" : "false");
    setBusy(true);
    setResult(null);
    try {
      const request = await fetch("/api/public/testimony-submit", { method: "POST", body: values });
      const response = await request.json() as { ok: boolean; message: string };
      setResult(response);
      if (response.ok) {
        form.reset(); setAudio(null); setPhoto(null); setPage(1);
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview("");
      }
    } catch (error) {
      setResult({ ok: false, message: error instanceof Error ? error.message : "Please review the form and try again." });
    } finally { setBusy(false); }
  };

  return (
    <main>
      <section className="bg-ink px-5 py-20 text-porcelain md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl"><Label dark>God&apos;s faithfulness, shared</Label><Display as="h1" className="max-w-4xl text-4xl sm:text-6xl md:text-8xl" color="var(--color-porcelain)">TESTIMONIES</Display>
          <p className="mt-6 max-w-2xl text-base leading-8 text-paper/75 md:text-lg">Share what God has done, or read testimonies reviewed for publication by the church.</p>
          <div className="mt-8 max-w-3xl border-l-2 border-gold pl-5" id="email-testimony">
            <p className="font-label text-xs font-bold uppercase text-gold">Prefer email?</p>
            <p className="mt-2 text-sm leading-7 text-paper/80">If this page is difficult to use, or you prefer to send your testimony directly, email testimonies@seedofchrist.org. You may include written text, an audio recording, or photos as appropriate.</p>
            <p className="mt-2 text-xs leading-6 text-paper/60">Emailed testimonies are reviewed and are not published automatically. The church must confirm permission before publication.</p>
            <a href="mailto:testimonies@seedofchrist.org" className="font-label mt-4 inline-flex min-h-12 items-center gap-2 border border-gold px-4 py-3 text-xs font-bold uppercase text-gold transition-colors hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"><Mail size={16} aria-hidden="true" />Send Your Testimony by Email</a>
            <p className="mt-3 select-text text-sm text-paper"><a href="mailto:testimonies@seedofchrist.org" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold">testimonies@seedofchrist.org</a></p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24" aria-labelledby="published-heading">
        <div className="mx-auto max-w-6xl"><SectionHead label="Published by the church" title="READ TESTIMONIES" />
          {archiveError && <p role="status" className="mb-5 border border-crimson p-4 text-sm">{archiveError}</p>}
          {archiveData.total > 0 && <div className="mb-9 grid gap-3 md:grid-cols-[1fr_260px]"><label className="relative block"><span className="sr-only">Search published testimonies</span><Search className="absolute left-4 top-1/2 -translate-y-1/2" size={17} aria-hidden="true" /><input value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }} placeholder="Search testimonies" className={`${inputClass} pl-11`} /></label><label><span className="sr-only">Filter testimonies by category</span><select value={category} onChange={(event) => { setPage(1); setCategory(event.target.value); }} className={inputClass}><option value="">All categories</option>{TESTIMONY_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label></div>}
          {archiveData.total === 0 && !archiveError ? <div className="border-y border-line py-14 text-center"><Display as="h2" className="text-3xl">THE ARCHIVE IS BEING PREPARED</Display><p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-70">No testimonies have been published here yet. Every submission is reviewed before it appears publicly.</p></div> : filtered.length === 0 && !archiveError ? <p role="status" className="border-y border-line py-10 text-center">No published testimonies match your search.</p> : <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <article key={item.id} className="flex min-h-72 flex-col bg-porcelain p-6 md:p-8"><div className="font-label text-[0.68rem] font-semibold uppercase text-golddeep">{item.category ?? "Testimony"} · {formatDate(item.published_at)}</div><Display as="h2" className="mt-5 text-2xl md:text-3xl">{item.title.toUpperCase()}</Display><p className="mt-4 line-clamp-4 text-sm leading-7 opacity-70">{item.testimony}</p><p className="mt-5 text-sm font-semibold">{item.full_name}{item.location ? ` · ${item.location}` : ""}</p>{item.audio_url && <p className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase text-golddeep"><Volume2 size={15} aria-hidden="true" />Audio testimony</p>}<Link to="/testimonies/$id" params={{ id: item.id }} className="font-label mt-auto inline-flex min-h-11 items-end gap-2 pt-6 text-xs font-bold uppercase text-golddeep">Read testimony <ArrowRight size={15} aria-hidden="true" /></Link></article>)}</div>}
          {archiveData.totalPages > 1 && <nav aria-label="Testimony archive pages" className="mt-8 flex items-center justify-center gap-4"><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="font-label inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs uppercase disabled:opacity-40"><ArrowLeft size={15} />Previous</button><span aria-live="polite">Page {page} of {archiveData.totalPages}</span><button type="button" disabled={page === archiveData.totalPages} onClick={() => setPage((current) => Math.min(archiveData.totalPages, current + 1))} className="font-label inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs uppercase disabled:opacity-40">Next<ArrowRight size={15} /></button></nav>}
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-porcelain md:px-8 md:py-28" aria-labelledby="submit-heading">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20"><div><Label dark>Tell of His goodness</Label><Display as="h2" className="text-4xl md:text-6xl" color="var(--color-porcelain)"><span id="submit-heading">SHARE YOUR TESTIMONY</span></Display><p className="mt-5 max-w-md text-sm leading-7 text-paper/70">Your submission goes to the church for review and will not appear publicly unless approved.</p><p className="mt-4 text-sm text-paper/75">You may share your testimony in writing, as an audio recording, or with an optional photo. Photos are never required.</p><p className="mt-5 text-sm text-paper/75">Need help submitting your testimony? <a href="mailto:testimonies@seedofchrist.org" className="font-semibold text-gold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold">Send it directly by email</a>.</p><p className="mt-2 select-text text-sm text-paper"><a href="mailto:testimonies@seedofchrist.org" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold">testimonies@seedofchrist.org</a></p><p className="mt-2 text-xs leading-6 text-paper/55">Emailed testimonies are also reviewed. The church must confirm permission before publication.</p></div>
          <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" id="fullName" required><input id="fullName" name="fullName" required minLength={2} maxLength={120} autoComplete="name" className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field><Field label="Email address" id="email" required><input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field><Field label="Location / city (optional)" id="location"><input id="location" name="location" maxLength={120} autoComplete="address-level2" className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field><Field label="Testimony title" id="title" required><input id="title" name="title" required minLength={3} maxLength={160} className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /></Field></div>
            <Field label="Category (optional)" id="category"><select id="category" name="category" className={`${inputClass} mt-1 border-porcelain/30 bg-ink text-porcelain`}><option value="">Choose a category</option>{TESTIMONY_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></Field>
            <Field label="Written testimony (optional when audio is attached)" id="testimony"><textarea id="testimony" name="testimony" maxLength={6000} rows={8} aria-describedby="testimony-requirement" className={`${inputClass} mt-1 border-porcelain/30 text-porcelain`} /><span id="testimony-requirement" className="mt-2 block text-xs text-paper/60">A written story or an audio recording is required. Photos are optional and cannot replace both.</span></Field>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Audio testimony (optional · up to 10 MB)" id="audio"><input id="audio" type="file" accept={AUDIO_ACCEPT} onChange={(event) => { const chosen = event.target.files?.[0] ?? null; setAudio(chosen && chosen.size <= AUDIO_MAX_BYTES && AUDIO_ACCEPT.toLowerCase().includes(chosen.type.toLowerCase()) ? chosen : null); if (chosen && (chosen.size > AUDIO_MAX_BYTES || !AUDIO_ACCEPT.toLowerCase().includes(chosen.type.toLowerCase()))) setResult({ ok: false, message: "Choose a supported audio file under 10 MB." }); }} className={`${inputClass} mt-1 border-porcelain/30 text-porcelain file:mr-3 file:border-0 file:bg-gold file:px-3 file:py-2 file:text-ink`} />{audioPreview && <audio controls preload="metadata" src={audioPreview} className="mt-3 w-full" />}</Field>
              <Field label="Photo evidence (optional · up to 5 MB)" id="photo"><input id="photo" type="file" accept={PHOTO_ACCEPT} onChange={(event) => void handlePhoto(event.target.files?.[0])} className={`${inputClass} mt-1 border-porcelain/30 text-porcelain file:mr-3 file:border-0 file:bg-gold file:px-3 file:py-2 file:text-ink`} />{photoPreview && <img src={photoPreview} alt="Preview of selected testimony photo" className="mt-3 max-h-48 max-w-full object-contain" />}</Field></div>
            <div className="pointer-events-none fixed left-0 top-0 size-px overflow-hidden opacity-0" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-paper/80"><input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-gold" /><span>I give Seed of Christ Golden Church permission to review and, where appropriate, publish my testimony on its website, social media platforms and other official ministry channels. I understand that submission does not guarantee publication.</span></label>
            <Btn type="submit" icon={Send} disabled={busy}>{busy ? "Submitting…" : "Submit for review"}</Btn>
            {result && <p role="status" aria-live="polite" className={`border p-4 text-sm ${result.ok ? "border-gold text-paper" : "border-crimson text-porcelain"}`}>{result.message}</p>}
          </form>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-24"><div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2"><div><Volume2 className="text-golddeep" size={25} aria-hidden="true" /><SectionHead label="Audio, photo & live testimonies" title="WATCH TESTIMONIES" sub="Video and live testimony content is shared through the official Church App." /><DeviceAwareAppButton tone="ghostDark">Watch More Testimonies on the Church App</DeviceAwareAppButton><AppBadges className="mt-5" /></div><div className="bg-ink p-7 text-porcelain md:p-10"><Label dark>Stay connected</Label><Display as="h2" className="text-3xl" color="var(--color-porcelain)">FOLLOW THE MINISTRY</Display><p className="mb-6 mt-3 text-sm leading-7 text-paper/65">Connect with the church&apos;s official social channels.</p><SocialLinks showLabels /></div></div></section>
    </main>
  );
}

function Field({ label, id, required = false, children }: { label: string; id: string; required?: boolean; children: React.ReactNode }) {
  return <div><label className="font-label text-xs font-bold uppercase text-paper" htmlFor={id}>{label}{required && <span className="text-gold"> *</span>}</label>{children}</div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}
