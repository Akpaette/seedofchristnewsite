import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { Display, Label } from "@/components/site/ui";
import { getPublishedTestimony } from "@/lib/testimonies.functions";

export const Route = createFileRoute("/testimonies/$id")({
  loader: async ({ params }) => {
    const testimony = await getPublishedTestimony({ data: { id: params.id } });
    if (!testimony) throw notFound();
    return testimony;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.title} | Testimonies — Seed of Christ Golden Church Worldwide`
      : "Testimony unavailable | Seed of Christ Golden Church Worldwide";
    const description = loaderData
      ? `Read ${loaderData.full_name}'s published testimony from Seed of Christ Golden Church Worldwide.`
      : "This testimony is not available.";
    return { meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  notFoundComponent: TestimonyNotFound,
  component: TestimonyDetail,
});

function TestimonyDetail() {
  const testimony = Route.useLoaderData();
  return (
    <main>
      <header className="bg-ink px-5 py-16 text-porcelain md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <Link to="/testimonies" className="font-label inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase text-gold"><ArrowLeft size={16} aria-hidden="true" /> All testimonies</Link>
          <div className="font-label mt-9 text-xs font-semibold uppercase text-gold">{testimony.category ?? "Testimony"} · {formatDate(testimony.published_at)}</div>
          <Display as="h1" className="mt-5 max-w-3xl text-4xl sm:text-5xl md:text-7xl" color="var(--color-porcelain)">{testimony.title.toUpperCase()}</Display>
          <p className="mt-7 text-base font-semibold text-paper">{testimony.full_name}</p>
          {testimony.location && <p className="mt-2 flex items-center gap-2 text-sm text-paper/60"><MapPin size={15} aria-hidden="true" /> {testimony.location}</p>}
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        {testimony.image_url && <img src={testimony.image_url} alt={`Supporting photograph for ${testimony.title}`} className="mb-12 max-h-[620px] w-full object-cover" />}
        {testimony.testimony && <div className="space-y-6 text-base leading-8 md:text-lg md:leading-9">{testimony.testimony.split(/\n{2,}/).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 60)}`}>{paragraph}</p>)}</div>}
        {testimony.audio_url && <div className="mt-12"><p className="font-label mb-3 text-xs font-bold uppercase">Audio testimony</p><audio controls preload="metadata" src={testimony.audio_url} className="w-full" aria-label={`Audio testimony: ${testimony.title}`} /></div>}
      </article>
    </main>
  );
}

function TestimonyNotFound() {
  return <main className="mx-auto max-w-3xl px-5 py-28 text-center"><Label>Testimonies</Label><Display as="h1" className="text-4xl">TESTIMONY UNAVAILABLE</Display><p className="mt-4 opacity-70">This testimony may still be under review or is no longer published.</p><Link to="/testimonies" className="font-label mt-7 inline-flex min-h-12 items-center border-2 border-ink px-5 text-xs font-bold uppercase">Return to testimonies</Link></main>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}