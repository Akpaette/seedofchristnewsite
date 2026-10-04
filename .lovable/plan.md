# Consolidated update: testimonies media, Up Next, branches, giving, Watch Live

The site stays on its current framework (TanStack Start, not Next.js). Requests that name Next.js, like `/app/api/...` or `NEXT_PUBLIC_*`, get the matching approach here: server functions and the existing Lovable Cloud backend. Everything not listed below stays as it is.

## 1. Testimonies: audio and photo evidence
- Form: written story, an optional audio file (MP3/M4A/AAC/WAV/OGG/WebM, up to 10 MB) and an optional photo (JPEG/PNG/WebP, up to 5 MB). You can send text only, audio only, a photo only, or any mix. Every submission needs at least a story or an audio file.
- The browser shows a preview before sending: a photo thumbnail and an audio player.
- Before upload, photos are redrawn in the browser to remove EXIF/GPS data and shrunk to about 1600 px wide JPEG.
- Video upload and video links are removed from the public form and the pages.
- Consent stays mandatory, and the server checks it again.
- Anti-spam: the honeypot stays. The server also limits each IP address to 5 submissions per hour, enforced through a database table.

## 2. Backend
- New table columns are added alongside the old ones. Nothing is dropped. Added: `testimony`, `audio_url`, `consent_to_publish`, `rejection_reason`, `submitted_at`, `reviewed_at`, `reviewed_by`, `updated_at`.
- Allowed statuses become pending, approved, rejected and archived. Any old "published" rows are moved to approved.
- Indexes are added on status, published_at and submitted_at.
- A private storage bucket called `testimony-media` holds files under `audio/` and `photos/`, with random file names.
- Visitors can only see approved records. Approved media is served through short-lived signed links, created on the server for approved records only.
- Uploads go through a server function, which checks file type and size before anything is stored. The service key stays on the server.
- The public archive shows 12 testimonies per page, with page controls.
- Admin roles live in a separate `user_roles` table and are checked with `has_role`.

## 3. Admin moderation page (`/admin/testimonies`)
- Email and password sign-in at `/auth`. Only accounts with the admin role can use the page.
- The page lists testimonies by status. An admin can read each one, play its audio, view its photo, and approve, reject (with a reason) or archive it. Each action records who reviewed it and when.
- You will need to make your first admin account. I will explain how once this is built.
- Email alerts to admin@seedofchrist.org can use the existing email setup if Resend keys are configured. Otherwise they are skipped.

## 4. Events: "Up Next"
- A new shared helper, `getUpNext(now)`, works out every event's next occurrence and picks the soonest one, in Lagos time.
- The Events page shows an "Up Next" label on that event. The home page gets a small Up Next panel with the same countdown.
- When a countdown hits zero, the page recalculates and moves Up Next to the following event. An `aria-live` status announces the change.
- If no future event exists, an empty-state message shows instead.

## 5. Branches
- A list of the 36 Nigerian states plus FCT is matched against the state field only, by whole name. Case, spacing, punctuation and the word "State" are ignored.
- Branches with no state stay "Unassigned". The UK branch shows as International / United Kingdom.
- Addresses are not changed. All 67 branches stay, sorted A to Z.
- Every branch shows "Service: 7:30 AM". All phone fields and placeholders are removed. Each branch's contact is a link to admin@seedofchrist.org.

## 6. Giving
- A new Dollar Donations section adds Zenith Bank, 5071744662, Mustapha Solomon, with a copy button. No SWIFT or routing details are added. There is still no Flutterwave.

## 7. Watch Live
- Android and iPhone go straight to the official store link, which is the reliable route on both. Each phone only ever gets its own store. Desktop shows both store badges.
- I will not invent an app link format. A setting is left ready for the app's real app-link or universal-link address. Once the app developer (ChurchCast) supplies it, Watch Live will try to open the app first.
- The page will note that the app developer must supply this link before Watch Live can open the app directly.

## 8. QA
- Check that the site builds. Use automated browser runs on phone and desktop sizes to test submissions with photo and audio, moderation, Up Next matching between Home and Events, branch filters, giving and Watch Live.

## Environment variables for Netlify
`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, plus the existing optional email keys.
