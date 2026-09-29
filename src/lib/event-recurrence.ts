export type RecurrenceKind =
  | "last-weekend"
  | "sunday-8"
  | "wednesday"
  | "thursday"
  | "first-three-days"
  | "first-friday"
  | "second-friday";

const LAGOS_OFFSET_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function lagosParts(now: Date) {
  const shifted = new Date(now.getTime() + LAGOS_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    date: shifted.getUTCDate(),
    day: shifted.getUTCDay(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  };
}

function lagosDate(year: number, month: number, date: number, hour = 0) {
  return new Date(Date.UTC(year, month, date, hour - 1));
}

function nextWeekday(now: Date, weekday: number, hour?: number) {
  const p = lagosParts(now);
  const targetHour = hour ?? 0;
  let days = (weekday - p.day + 7) % 7;
  const todayHasPassed =
    days === 0 &&
    (p.hour > targetHour ||
      (p.hour === targetHour && (p.minute > 0 || p.second > 0)));
  if (todayHasPassed) days = 7;
  return lagosDate(p.year, p.month, p.date + days, targetHour);
}

function nthFriday(year: number, month: number, ordinal: 1 | 2) {
  const first = lagosDate(year, month, 1);
  const firstDay = lagosParts(first).day;
  const firstFriday = 1 + ((5 - firstDay + 7) % 7);
  return lagosDate(year, month, firstFriday + (ordinal - 1) * 7);
}

function lastSaturday(year: number, month: number) {
  const last = lagosDate(year, month + 1, 0);
  const p = lagosParts(last);
  return lagosDate(year, month, p.date - ((p.day - 6 + 7) % 7));
}

function firstThreeDays(now: Date) {
  const p = lagosParts(now);
  if (p.date <= 3) {
    const today = lagosDate(p.year, p.month, p.date);
    if (now.getTime() <= today.getTime()) return today;
    if (p.date < 3) return lagosDate(p.year, p.month, p.date + 1);
  }
  return lagosDate(p.year, p.month + 1, 1);
}

function monthlyDate(now: Date, getter: (year: number, month: number) => Date) {
  const p = lagosParts(now);
  const current = getter(p.year, p.month);
  return current.getTime() >= now.getTime() ? current : getter(p.year, p.month + 1);
}

export function nextOccurrence(kind: RecurrenceKind, now = new Date()) {
  switch (kind) {
    case "sunday-8":
      return nextWeekday(now, 0, 8);
    case "wednesday":
      return nextWeekday(now, 3);
    case "thursday":
      return nextWeekday(now, 4);
    case "first-three-days":
      return firstThreeDays(now);
    case "first-friday":
      return monthlyDate(now, (year, month) => nthFriday(year, month, 1));
    case "second-friday":
      return monthlyDate(now, (year, month) => nthFriday(year, month, 2));
    case "last-weekend":
      return monthlyDate(now, lastSaturday);
  }
}

export function countdownParts(target: Date, now: Date) {
  const total = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(total / DAY_MS),
    hours: Math.floor((total % DAY_MS) / (60 * 60 * 1000)),
    minutes: Math.floor((total % (60 * 60 * 1000)) / (60 * 1000)),
    seconds: Math.floor((total % (60 * 1000)) / 1000),
  };
}
