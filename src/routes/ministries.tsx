import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Display, Page, Reveal, SectionHead } from "@/components/site/ui";
import { MINISTRIES } from "@/lib/church-data";

const TITLE = "Ministries — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Fellowships, choir, youth, children's church and media teams serving at Seed of Christ Golden Church Worldwide.";

export const Route = createFileRoute("/ministries")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/ministries" },
    ],
    links: [{ rel: "canonical", href: "/ministries" }],
  }),
  component: MinistriesPage,
});

function MinistriesPage() {
  return (
    <Page>
      <SectionHead
        as="h1"
        label="Serve & belong"
        title="Ministry is faith in action"
        sub="Across generations and areas of service, the church gathers people to worship, grow in God's Word, care for one another, and take their place in the work of the Gospel."
      />
      <div className="mb-14 grid gap-8 border-y border-line py-8 text-base leading-8 md:grid-cols-2">
        <p>Our ministries give members practical places to share fellowship, strengthen faith, and serve the church family with humility and purpose.</p>
        <p className="text-foreground/65">Each expression remains rooted in the life of the church: biblical teaching, prayer, worship, evangelism, and service shaped by the leading of the Holy Spirit.</p>
      </div>
      <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {MINISTRIES.map((ministry, index) => (
            <article key={ministry.name} className="group border-t border-line py-7">
              <div className="font-label mb-8 text-xs text-golddeep">{String(index + 1).padStart(2, "0")}</div>
              <Display as="h2" className="text-2xl">
                {ministry.name}
              </Display>
            </article>
          ))}
        </div>
      </Reveal>
      <aside className="mt-16 bg-ink p-7 text-porcelain md:flex md:items-center md:justify-between md:p-10">
        <div><div className="font-label text-xs text-gold">Ministry enquiries</div><p className="mt-2 max-w-xl text-porcelain/70">To learn where you can belong and serve, contact the church office.</p></div>
        <a href="mailto:info@seedofchrist.org" className="font-label mt-6 inline-flex min-h-12 items-center gap-2 border border-gold px-5 py-3 text-xs font-semibold uppercase text-gold transition-colors hover:bg-gold hover:text-ink md:mt-0">info@seedofchrist.org <ArrowUpRight size={16} /></a>
      </aside>
    </Page>
  );
}