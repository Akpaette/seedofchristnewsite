import { createFileRoute } from "@tanstack/react-router";
import { Display, Page, PlaceholderNote, Reveal, SectionHead } from "@/components/site/ui";
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
        title="MINISTRIES"
        sub="There is a place for every member of the family. Descriptions are pending confirmation from each ministry lead."
      />
      <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {MINISTRIES.map((m) => (
            <div key={m.name} className="border-ink bg-porcelain border-2 p-5">
              <Display as="h2" className="text-xl">
                {m.name.toUpperCase()}
              </Display>
              <div className="mt-3">
                <PlaceholderNote>{m.blurb}</PlaceholderNote>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Page>
  );
}