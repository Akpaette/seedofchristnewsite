// Content source of truth for Seed of Christ Golden Church Worldwide.
// Anything wrapped in [PLACEHOLDER ...] is unconfirmed and is rendered with the
// crimson flagged treatment so it can never quietly ship as real content.
//
// NOTE: Service times are intentionally NOT published anywhere on the site yet —
// the church has not confirmed them. Do not add a SERVICE_TIMES export until they do.

import apostlePhoto from "@/assets/apostle-mustapha.jpg.asset.json";


export type Branch = {
  name: string;
  state: string;
  address: string;
  phone: string;
  hq?: boolean;
};

export const BRANCHES: Branch[] = [
  {
    name: "Ibadan (Headquarters)",
    state: "Oyo State, Nigeria",
    address: "[PLACEHOLDER street address], Ibadan",
    phone: "[PLACEHOLDER phone]",
    hq: true,
  },
  {
    name: "Sango Ota",
    state: "Ogun State, Nigeria",
    address: "[PLACEHOLDER street address], Sango Ota",
    phone: "[PLACEHOLDER phone]",
  },
  {
    name: "Ilesha",
    state: "Osun State, Nigeria",
    address: "[PLACEHOLDER street address], Ilesha",
    phone: "[PLACEHOLDER phone]",
  },
  {
    name: "London / Enfield",
    state: "United Kingdom",
    address: "[PLACEHOLDER street address], Enfield, London",
    phone: "[PLACEHOLDER phone]",
  },
  {
    name: "[PLACEHOLDER branch]",
    state: "[PLACEHOLDER region]",
    address: "[PLACEHOLDER street address]",
    phone: "[PLACEHOLDER phone]",
  },
];

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
    photo: false,
  },
  {
    name: "John Akpaette",
    title: "General Administrative Officer",
    branch: "Ibadan HQ",
    photo: false,
  },
  { name: "", title: "", branch: "", photo: false },
];

export type Sermon = {
  title: string;
  speaker: string;
  series: string;
  date: string;
  scripture: string;
};

export const SERMONS: Sermon[] = [
  {
    title: "Rooted in the Vine",
    speaker: "[PLACEHOLDER speaker]",
    series: "Abiding Series",
    date: "2026-08-09",
    scripture: "John 15:1–8",
  },
  {
    title: "The Weight of Glory",
    speaker: "[PLACEHOLDER speaker]",
    series: "Kingdom Foundations",
    date: "2026-08-02",
    scripture: "2 Corinthians 4:17",
  },
  {
    title: "A House of Prayer",
    speaker: "[PLACEHOLDER speaker]",
    series: "Kingdom Foundations",
    date: "2026-07-26",
    scripture: "Isaiah 56:7",
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
  date: string;
  location: string;
  needsRsvp: boolean;
};

export const EVENTS: ChurchEvent[] = [
  {
    name: "Annual Convention",
    date: "2026-09-14",
    location: "Ibadan HQ",
    needsRsvp: true,
  },
  {
    name: "Youth Retreat",
    date: "2026-09-27",
    location: "[PLACEHOLDER venue]",
    needsRsvp: true,
  },
  {
    name: "Sunday Worship",
    date: "2026-08-23",
    location: "All branches",
    needsRsvp: false,
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