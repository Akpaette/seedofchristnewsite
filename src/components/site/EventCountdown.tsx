import { useEffect, useMemo, useState } from "react";
import { countdownParts, nextOccurrence, type RecurrenceKind } from "@/lib/event-recurrence";

export function EventCountdown({ kind, exactTime }: { kind: RecurrenceKind; exactTime: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    if (!now) return null;
    return countdownParts(nextOccurrence(kind, now), now);
  }, [kind, now]);

  const parts = countdown ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const label = countdown
    ? `${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds until the next occurrence`
    : "Countdown loading";

  return (
    <div className="mt-7 border-t border-gold/25 pt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-label text-[0.68rem] font-semibold uppercase text-gold">Next gathering</span>
        {!exactTime && <span className="text-xs text-porcelain/55">Time not supplied</span>}
      </div>
      <div className="grid grid-cols-4 gap-2" aria-label={label} aria-live="off">
        {([
          ["Days", parts.days],
          ["Hours", parts.hours],
          ["Minutes", parts.minutes],
          ["Seconds", parts.seconds],
        ] as const).map(([unit, value]) => (
          <div key={unit} className="border border-porcelain/15 bg-porcelain/[0.035] px-2 py-3 text-center">
            <div className="font-display text-2xl tabular-nums text-porcelain md:text-3xl">
              {countdown ? String(value).padStart(2, "0") : "--"}
            </div>
            <div className="font-label mt-1 text-[0.58rem] uppercase text-porcelain/50">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
