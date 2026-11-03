import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { EventCountdown } from "@/components/site/EventCountdown";
import { Display, Page, SectionHead } from "@/components/site/ui";
import { EVENTS } from "@/lib/church-data";
import { getUpNext } from "@/lib/events-up-next";
import { useClock } from "@/components/site/UpNext";

const TITLE = "Events — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Recurring services, vigils and monthly gatherings at Seed of Christ Golden Church Worldwide, with live West Africa Time countdowns.";

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
  const now = useClock();
  const upcoming = now ? getUpNext(now) : null;
  return (
    <Page className="max-w-6xl">
      <SectionHead as="h1" label="Gather with us" title="Recurring Events" sub="Our regular gatherings across headquarters and branches. Countdowns follow West Africa Time." />
      {upcoming && <p className="font-label mb-8 border-l-2 border-gold px-4 py-2 text-xs font-semibold uppercase text-gold" aria-live="polite">Up Next · {upcoming.event.name} · {upcoming.scheduleLabel}</p>}
      {!upcoming && <p role="status" className="mb-8 border-y border-line py-5 text-center">No upcoming gatherings are scheduled.</p>}
      <div className="grid gap-px bg-line/25 md:grid-cols-2">
        {EVENTS.map((event, index) => {
          const occurrences = [
            { recurrence: event.recurrence, label: event.secondaryRecurrence ? "Headquarters countdown" : "Next gathering", timeLabel: event.schedule },
            ...(event.secondaryRecurrence ? [{ recurrence: event.secondaryRecurrence, label: "Other branches countdown", timeLabel: event.secondarySchedule }] : []),
          ];
          return (
          <article key={event.name} className="group bg-ink p-6 text-porcelain transition-colors hover:bg-ink2 md:p-8">
            <div className="font-label mb-8 flex items-center justify-between gap-3 text-xs text-gold"><span>{String(index + 1).padStart(2, "0")}</span>{upcoming?.event.name === event.name && <span className="border border-gold px-3 py-1">Up Next</span>}</div>
            <Display as="h2" className="text-3xl md:text-4xl" color="var(--color-porcelain)">{event.name}</Display>
            <dl className="mt-6 space-y-3 text-sm text-porcelain/70">
              {event.location && <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-gold" size={16} /><div><dt className="sr-only">Location</dt><dd>{event.location}</dd></div></div>}
              <div className="flex gap-3"><CalendarDays className="mt-0.5 shrink-0 text-gold" size={16} /><div><dt className="sr-only">Frequency</dt><dd>{event.frequency}</dd></div></div>
              {event.schedule && <div className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-gold" size={16} /><div><dt className="sr-only">Schedule</dt><dd>{event.schedule}</dd></div></div>}
            </dl>
            {occurrences.map((occurrence) => <EventCountdown key={occurrence.label} kind={occurrence.recurrence} exactTime={event.exactTime && occurrence.recurrence === event.recurrence} label={occurrence.timeLabel ?? occurrence.label} />)}
          </article>
          );
        })}
      </div>
    </Page>
  );
}