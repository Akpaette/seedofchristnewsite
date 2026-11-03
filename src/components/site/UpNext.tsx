import { useEffect, useState } from "react";
import { CalendarClock, MapPin } from "lucide-react";
import { Display } from "./ui";
import { EventCountdown } from "./EventCountdown";
import { getUpNext } from "@/lib/events-up-next";

export function UpNextPanel() {
  const now = useClock();
  const next = now ? getUpNext(now) : null;
  if (!next) return <p role="status" className="border-y border-line py-8 text-center">No upcoming gatherings are scheduled.</p>;
  return (
    <section aria-label="Up Next" className="border-y border-gold/40 bg-ink px-5 py-8 text-porcelain md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="font-label flex items-center gap-2 text-xs font-semibold uppercase text-gold"><CalendarClock size={16} aria-hidden="true" /> Up Next</div>
        <Display as="h2" className="mt-3 text-3xl md:text-4xl" color="var(--color-porcelain)">{next.event.name}</Display>
        {next.event.location && <p className="mt-3 flex items-center gap-2 text-sm text-porcelain/65"><MapPin size={15} aria-hidden="true" />{next.event.location}</p>}
        <EventCountdown target={next.occurrence} exactTime={next.event.exactTime && next.recurrence === next.event.recurrence} label={next.scheduleLabel} />
      </div>
    </section>
  );
}

export function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);
  return now;
}
