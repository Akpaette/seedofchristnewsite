// Content source of truth for Seed of Christ Golden Church Worldwide.
// Anything wrapped in [PLACEHOLDER ...] is unconfirmed and is rendered with the
// crimson flagged treatment so it can never quietly ship as real content.
//
// NOTE: Service times are intentionally NOT published anywhere on the site yet —
// the church has not confirmed them. Do not add a SERVICE_TIMES export until they do.

import apostlePhoto from "@/assets/apostle-mustapha.jpg.asset.json";
import prophetessPhoto from "@/assets/prophetess-eunice-mustapha.jpg.asset.json";


export type { Branch } from "./branches-data";
export { BRANCHES } from "./branches-data";

export const APP_LINKS = {
  android: "https://play.google.com/store/apps/details?id=com.churchcast.scgc",
  ios: "https://apps.apple.com/us/app/seed-of-christ-golden-church/id6797294392",
};

export type Leader = {
  name: string;
  title: string;
  branch: string;
  photo: boolean;
  /** CDN URL of a supplied photograph, when one exists. */
  photoUrl?: string;
  alsoKnownAs?: string;
};

export const LEADERS: Leader[] = [
  {
    name: "Apostle Dr. S.M.O. Mustapha JP",
    alsoKnownAs: "Baba Sebioba",
    title: "General Overseer",
    branch: "Ibadan HQ",
    photo: true,
    photoUrl: apostlePhoto.url,
  },
  {
    name: "Prophetess Eunice Mustapha",
    alsoKnownAs: "Mama Sebioba",
    title: "Mother in Israel",
    branch: "Ibadan HQ",
    photo: true,
    photoUrl: prophetessPhoto.url,
  },
];

export const MINISTRIES: { name: string; blurb: string }[] = [
  { name: "Men's Fellowship", blurb: "[PLACEHOLDER description]" },
  { name: "Women's Fellowship", blurb: "[PLACEHOLDER description]" },
  { name: "Youth Ministry", blurb: "[PLACEHOLDER description]" },
  { name: "Children's Church", blurb: "[PLACEHOLDER description]" },
  { name: "Choir & Music Ministry", blurb: "[PLACEHOLDER description]" },
  { name: "Ushering & Protocol", blurb: "[PLACEHOLDER description]" },
  { name: "Media Ministry", blurb: "[PLACEHOLDER description]" },
];

export type ChurchEvent = {
  name: string;
  location?: string;
  schedule?: string;
  frequency: string;
  recurrence: import("./event-recurrence").RecurrenceKind;
  exactTime: boolean;
};

export const EVENTS: ChurchEvent[] = [
  {
    name: "Monthly National Camp Meeting",
    location: "National Camp Ground, Lufuape",
    frequency: "Every last weekend of every month",
    recurrence: "last-weekend",
    exactTime: false,
  },
  {
    name: "Sunday Services",
    location: "All Branches",
    schedule: "8:00 AM WAT",
    frequency: "Every Sunday",
    recurrence: "sunday-8",
    exactTime: true,
  },
  {
    name: "Power to Reign as Kings — Headquarters",
    location: "Headquarters",
    schedule: "Wednesdays",
    frequency: "Weekly",
    recurrence: "wednesday",
    exactTime: false,
  },
  {
    name: "Power to Reign as Kings — Other Branches",
    location: "Other Branches",
    schedule: "Thursdays",
    frequency: "Weekly",
    recurrence: "thursday",
    exactTime: false,
  },
  {
    name: "Monthly Bethesda Services",
    frequency: "First 3 days of every month",
    recurrence: "first-three-days",
    exactTime: false,
  },
  {
    name: "Monthly Vigil — Headquarters",
    location: "Headquarters",
    frequency: "Every first Friday of every month",
    recurrence: "first-friday",
    exactTime: false,
  },
  {
    name: "Monthly Vigil — Igando",
    location: "Igando Branch, Lagos State",
    frequency: "Every second Friday of every month",
    recurrence: "second-friday",
    exactTime: false,
  },
];

export const NAV_PRIMARY = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/give", label: "Give" },
  { to: "/prayer", label: "Prayer" },
] as const;

export const NAV_MORE = [
  { to: "/about", label: "About" },
  { to: "/sermons", label: "Sermons" },
  { to: "/ministries", label: "Ministries" },
  { to: "/branches", label: "Branches" },
  { to: "/bible-college", label: "Bible College" },
  { to: "/radio", label: "Radio" },
  { to: "/contact", label: "Contact" },
] as const;

export const isPlaceholder = (value?: string) =>
  !!value && value.includes("[PLACEHOLDER");