import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { EventCountdown } from "@/components/site/EventCountdown";
import { Display, Page, SectionHead } from "@/components/site/ui";
import { EVENTS } from "@/lib/church-data";

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
  return (
    <Page className="max-w-6xl">
      <SectionHead as="h1" label="Gather with us" title="Recurring Events" sub="Our regular gatherings across headquarters and branches. Countdowns follow West Africa Time." />
      <div className="grid gap-px bg-line/25 md:grid-cols-2">
        {EVENTS.map((event, index) => (
          <article key={event.name} className="group bg-ink p-6 text-porcelain transition-colors hover:bg-ink2 md:p-8">
            <div className="font-label mb-8 text-xs text-gold">{String(index + 1).padStart(2, "0")}</div>
            <Display as="h2" className="text-3xl md:text-4xl" color="#F5F3EE">{event.name}</Display>
            <dl className="mt-6 space-y-3 text-sm text-porcelain/70">
              {event.location && <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-gold" size={16} /><div><dt className="sr-only">Location</dt><dd>{event.location}</dd></div></div>}
              <div className="flex gap-3"><CalendarDays className="mt-0.5 shrink-0 text-gold" size={16} /><div><dt className="sr-only">Frequency</dt><dd>{event.frequency}</dd></div></div>
              {event.schedule && <div className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-gold" size={16} /><div><dt className="sr-only">Schedule</dt><dd>{event.schedule}</dd></div></div>}
            </dl>
            <EventCountdown kind={event.recurrence} exactTime={event.exactTime} />
          </article>
        ))}
      </div>
    </Page>
  );
}