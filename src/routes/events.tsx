import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { Btn, Display, Page, SectionHead } from "@/components/site/ui";
import { EVENTS, isPlaceholder } from "@/lib/church-data";

const TITLE = "Events — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Conventions, retreats and gatherings at Seed of Christ Golden Church Worldwide. RSVP for events across our Nigeria and London branches.";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsPage,
});

function EventsPage() {
  const [rsvped, setRsvped] = useState<Record<string, boolean>>({});

  return (
    <Page>
      <SectionHead as="h1" label="What's coming up" title="EVENTS" />
      <div className="space-y-3">
        {EVENTS.map((e) => (
          <div
            key={e.name}
            className="border-ink flex flex-col gap-3 border-2 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <CalendarIcon color="#C81E3A" size={20} />
              <div>
                <Display as="h2" className="text-lg">
                  {e.name.toUpperCase()}
                </Display>
                <div className="text-xs opacity-70">
                  {e.date} ·{" "}
                  {isPlaceholder(e.location) ? (
                    <span className="text-crimson font-semibold">{e.location}</span>
                  ) : (
                    e.location
                  )}
                </div>
              </div>
            </div>
            {e.needsRsvp &&
              (rsvped[e.name] ? (
                <span className="text-crimson font-label flex items-center gap-1.5 text-xs font-bold uppercase">
                  <Check size={14} /> RSVP received
                </span>
              ) : (
                <Btn
                  tone="crimson"
                  onClick={() => setRsvped((prev) => ({ ...prev, [e.name]: true }))}
                >
                  RSVP
                </Btn>
              ))}
          </div>
        ))}
      </div>
      <p className="border-crimson text-crimson font-label mt-8 border-2 border-dashed p-3 text-xs font-semibold uppercase">
        ⚠ RSVPs are captured in the browser only — connect a backend before launch so
        submissions reach the church office.
      </p>
    </Page>
  );
}