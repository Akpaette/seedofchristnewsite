import { EVENTS, type ChurchEvent } from "./church-data";
import { nextOccurrence, type RecurrenceKind } from "./event-recurrence";

export type UpcomingEvent = {
  event: ChurchEvent;
  recurrence: RecurrenceKind;
  occurrence: Date;
  scheduleLabel: string;
};

/** The single source for the next chronological scheduled church gathering. */
export function getUpNext(now = new Date()): UpcomingEvent | null {
  const candidates = EVENTS.flatMap((event) => {
    const occurrences: UpcomingEvent[] = [{
      event,
      recurrence: event.recurrence,
      occurrence: nextOccurrence(event.recurrence, now),
      scheduleLabel: event.schedule ?? "Next gathering",
    }];
    if (event.secondaryRecurrence) {
      occurrences.push({
        event,
        recurrence: event.secondaryRecurrence,
        occurrence: nextOccurrence(event.secondaryRecurrence, now),
        scheduleLabel: event.secondarySchedule ?? "Other branches",
      });
    }
    return occurrences;
  });
  candidates.sort((a, b) => a.occurrence.getTime() - b.occurrence.getTime());
  return candidates[0] ?? null;
}
