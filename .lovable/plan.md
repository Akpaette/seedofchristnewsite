# Targeted Testimonies, Giving, App, and Social Enhancement

## What will change

- Remove the Radio & Television page and every internal link to it, then add Testimonies to desktop, mobile, footer, and sitemap navigation.
- Replace “Watch Live” with a reusable Church App action: Android opens Google Play, iPhone/iPad opens the App Store, and desktop/other devices see both official download badges.
- Add a public Testimonies archive, secure submission form, and dedicated full-testimony pages. With no approved testimonies yet, the archive will show an honest empty state and direct video/live testimony visitors to the Church App.
- Replace Flutterwave, Paystack placeholders, amount selectors, and unconfirmed bank details with only the supplied First Bank and Zenith Bank accounts, including accessible copy buttons and success feedback.
- Add the exact Facebook, Instagram, YouTube, and TikTok profiles to the footer, contact page, and one restrained homepage section.
- Standardize the two official app badges inside equal-size responsive containers and refine the existing gold token to a more authentic champagne-gold.

## Testimony moderation and privacy

- Store submissions in Lovable Cloud with a default `pending` status and required publication consent.
- Public visitors can submit, but cannot read pending records, change statuses, or publish content.
- Public reads expose only approved testimony fields; email and phone remain inaccessible.
- Moderators will review and approve entries in the Cloud data view for now. No insecure public moderation screen or media uploader will be added.
- Approved entries appear automatically in the archive and open on a dedicated detail URL.

## Technical details

- Add one `testimonies` table with field-length checks, category constraints, required consent, moderation status, timestamps, explicit grants, row-level security, and an index for published browsing.
- Add validated server functions for submissions and approved-only reads. Server validation uses Zod; browser fields mirror the same limits.
- Add `/testimonies` and `/testimonies/$id` routes with unique title, description, Open Graph, and Twitter metadata.
- Use the existing TanStack Start and Nitro/Netlify setup unchanged. Update generated route references indirectly by adding/removing route files only.
- Keep media uploads out until secure storage and moderation requirements are defined; the page will not show fake video or testimony content.

## Verification

- Test required fields, consent enforcement, pending moderation, approved-only public reads, empty/archive/detail states, and no exposure of contact information.
- Test Android, iOS, and desktop App behavior; exact store/social links; copy-account feedback; desktop, tablet, and mobile layouts; keyboard focus; no horizontal overflow.
- Confirm Radio/TV and Flutterwave references are gone, all routes and sitemap links work, browser console is clean, and the production build succeeds.