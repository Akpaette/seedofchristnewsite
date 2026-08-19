import { createFileRoute } from "@tanstack/react-router";
import { Radio as RadioIcon, Tv } from "lucide-react";
import { Display, Page, PlaceholderNote, SectionHead } from "@/components/site/ui";

const TITLE = "Radio & TV — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Listen to the Seed of Christ radio stream and watch Sebioba Royal TV, our 24-hour free-to-air channel.";

export const Route = createFileRoute("/radio")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/radio" },
    ],
    links: [{ rel: "canonical", href: "/radio" }],
  }),
  component: RadioPage,
});

function RadioPage() {
  return (
    <Page className="max-w-3xl">
      <SectionHead as="h1" label="On air" title="RADIO & TV" />

      <div className="border-ink bg-porcelain mb-6 border-2 p-6">
        <div className="flex items-center gap-2">
          <RadioIcon color="#C81E3A" size={18} />
          <Display as="h2" className="text-2xl">
            RADIO STREAM
          </Display>
        </div>
        <p className="mt-2 text-sm opacity-75">
          Preaching, worship and prayer around the clock.
        </p>
        <div className="mt-4">
          <PlaceholderNote>
            ⚠ Stream URL needed from the church — the player will be wired to it. No
            placeholder stream is used.
          </PlaceholderNote>
        </div>
      </div>

      <div className="border-ink border-2 p-6">
        <div className="flex items-center gap-2">
          <Tv color="#C81E3A" size={18} />
          <Display as="h2" className="text-2xl">
            SEBIOBA ROYAL TV
          </Display>
        </div>
        <p className="mt-2 text-sm opacity-75">
          A 24-hour free-to-air television channel.
        </p>
        <div className="mt-4">
          <PlaceholderNote>
            ⚠ Satellite/frequency details and any live embed link pending from the media
            team.
          </PlaceholderNote>
        </div>
      </div>
    </Page>
  );
}