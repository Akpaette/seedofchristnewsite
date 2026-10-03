# Golden Church Website

You are completing the official website for Seed of Christ Golden
Church Worldwide, a Nigerian Pentecostal church headquartered in
Ibadan with branches across Nigeria and in London. A starter
scaffold already exists in this repo — read it fully
( components/data.js , components/pages.jsx ,
components/Header.jsx , components/Footer.jsx ,
components/ui.jsx , tailwind.config.js ) before writing
anything.
Stack — already chosen, keep it
Next.js 14 (App Router), React 18, Tailwind CSS, lucide-react icons.
Deploy target is Vercel.
Design system — already established, don't deviate
without asking
Colors: ink #17130F , porcelain #F4F0E6 , paper #EAE2CE ,
gold #E7B23A , gold-deep #B9862A , crimson #C81E3A , indigo
#241B4A , charcoal #201C18 , line #DCD2B4
Type: Display = Bebas Neue (tall condensed caps), Body =
Inter, Labels = Space Grotesk
Motif: a diagonal gold "beam" (light-ray) at hero sections and
section seams, tying back to the church's name
Voice: confident, warm, scripture-grounded — not corporate,
not stiff
What's already built — don't rebuild these, extend them
Nav: Home, Events, Give, Prayer (primary) / About, Sermons,
Ministries, Branches, Bible College, Testimonies, Contact (secondary).
Sticky header with a service-time strip, mobile bottom tab bar,
footer with service times and social links. Sermons page already
has working series-filter and date-sort. Leadership cards already
visibly flag incomplete profiles instead of silently showing blanks.
Copyright year is already dynamic. Icons are already real icon
components, not text labels.
Your task, in order
1. Fill every [PLACEHOLDER] and [REAL PHOTO NEEDED] marker
in data.js and pages.jsx using the confirmed facts below.
Where something is genuinely still unknown, keep it visibly
flagged in the same style as the existing leadership-card
pattern — never invent a plausible-sounding fake to fill a gap.
2. Wire the stubbed integrations the README calls out:
Formspree or Resend for the Prayer Request / Contact /
Newsletter forms; the confirmed bank-transfer channels for Give;
and the keyless OpenStreetMap branch directory.
3. Accessibility pass: alt text on every image, visible focus states
(partially in place already — finish it), full keyboard navigation
through the mobile menu, captions/transcripts for any
embedded sermon audio or video.
4. SEO basics: unique title and meta description per page, a
robots.txt (a placeholder exists at public/robots.txt )
that explicitly allows search engine crawlers, and a
sitemap.xml.
5. Performance: compress and lazy-load images, and check a
mobile Lighthouse score before marking any page done.
Confirmed facts — use these, don't ask again
Legal/display name: Seed of Christ Golden Church Worldwide
Headquarters: Orisunbare Street, Gbaremu Idi-Obi, Airport
Area, Ibadan, Oyo State, Nigeria
General Overseer: Apostle Dr. S.M.O. Mustapha JP, also known
as Baba Sebioba
Mother in Israel: Prophetess Eunice Mustapha, also known as
Mama Sebioba
Branches confirmed so far: Ibadan (HQ), Sango Ota, Ilesha,
London/Enfield — there are more branches than this; get the
full current list from the client
London branch: 46 Queensway Road, Enfield Town, UK · +44
7925 749747 · Seedofchristlondon@yahoo.com
HQ contact: admin@seedofchrist.org / info@seedofchrist.org ·
Tel +234 806 029 1930 · Prayer line +234 808 208 8888
⚠ Service time conflict to resolve: the scaffold's data.js
currently says Sunday 8:00 AM & 10:30 AM, but the church's
current live site says Sunday 9:00 AM (WAT). Confirm the real,
current time with the client before shipping — don't guess
which is right.
Media presence: Facebook, YouTube, Instagram and TikTok.
There is a Bible College — "Seed of Christ Golden Church Land
of Reality Worldwide Bible College," Ibadan — give it a real
page, not just a nav placeholder
Giving: official First Bank and Zenith Bank transfer details are
published on the Give page.
Still needed from the client — ask, don't guess or
substitute stock art
Official logo file (vector/SVG or a high-resolution PNG with a
transparent background)
Real photography: building exterior and interior, congregation
in worship, choir, children's church, a Bible college class, and
each branch — to replace every [REAL PHOTO NEEDED] tag
A complete, current branch list with verified addresses, phone
numbers, and service times for every location, not just the four
confirmed above
Names, titles, and headshots for every pastor/leader beyond
the two already confirmed
Sermon library: real speaker names, audio/video files or
embed links, and whether transcripts already exist
A paragraph description for each ministry (Men's, Women's,
Youth, Children's, Choir & Music, Ushering & Protocol, Media)
Any future online giving provider must be separately confirmed
before it is added.
Guardrails
Don't invent quotes, statistics, or biographical detail for real
people — leave it clearly flagged instead, matching the existing
incomplete-profile pattern.
Don't source or reuse imagery, copy, layout, or design elements
from any other church's website — everything here is original to
Seed of Christ.
Keep placeholders visually distinct (the existing crimson-
flagged style) until real content replaces them, so nothing fake
accidentally ships to production.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://golden-seed-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b6886e73-5f1c-4059-81b9-c8275fe4d6e4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
