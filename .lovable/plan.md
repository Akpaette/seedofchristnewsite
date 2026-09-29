# Seed of Christ Website Production Update

## Goal
Deliver the requested map, recurring events, ministry and Bible College content, and a site-wide **Golden Editorial Prestige** refresh without rebuilding the site or changing confirmed church information.

## Confirmed design direction
- **Palette:** Noir & Gold — `#0D0D0D`, `#1A1A1A`, `#C9A84C`, `#F5F3EE`
- **Typography:** Libre Baskerville headings with IBM Plex Sans body copy
- **Layout:** Editorial magazine composition with cinematic church photography, fine rules, spacious grids, restrained gold, and subtle motion
- The visual mockup is structural inspiration only. Its invented dates, quotations, leaders, buildings, and descriptions will not be used.

## Implementation

### 1. Shared visual system and navigation
- Replace the current display/body type treatment and broad color usage with semantic Noir & Gold tokens while retaining crimson only for genuine missing-information warnings.
- Refine the sticky header, desktop navigation, mobile menu, bottom tabs, footer, buttons, forms, focus states, and shared page headings.
- Keep all current routes and useful navigation behavior intact.
- Apply consistent editorial spacing, borders, image treatments, and reduced-motion-safe reveals across content pages.

### 2. Homepage
- Recompose the first viewport around existing church photography with the official church name as the primary headline, concise confirmed supporting copy, and existing Visit/Live actions.
- Keep the moving photo gallery and official app badges, adapting both to the chosen editorial system.
- Retain the confirmed General Overseer feature, family list, media area, and prayer CTA without introducing unsupported claims.

### 3. Branch directory and map
- Keep all 67 supplied branches, their address wording, alphabetical order, state/international filtering, and list count.
- Add name/address search and selected-branch state shared by the list and map.
- Add an SSR-safe, client-loaded Leaflet/OpenStreetMap map with responsive sizing, accessible controls, marker labels, popups, and explicit attribution.
- Generate coordinates only from supplied addresses through a one-time geocoding pass; retain only results that can be verified with adequate confidence. Unverified branches remain fully visible in the directory and are clearly marked as awaiting a verified map position rather than assigned an invented point.
- Default the main viewport to Nigeria; treat the UK branch as an explicit international selection so it does not distort the Nigerian extent.
- Clicking a mapped branch card focuses its marker; clicking a marker selects the matching branch card.

### 4. Recurring events and countdowns
- Replace the old event data with only the six supplied recurring events.
- Add timezone-aware recurrence utilities for Africa/Lagos covering Sundays at 8:00 AM, Wednesdays/Thursdays, the first three days of each month, first Friday, second Friday, and the last weekend of each month.
- Build hydration-safe countdowns that begin after client mount, update every second, roll forward automatically, and expose Days/Hours/Minutes/Seconds to assistive technology.
- For entries without a supplied time, show **Time not supplied** and use the start of the recurrence date only as the technical rollover boundary; never present midnight as a service time.
- Redesign event cards with clear schedule/location distinctions and restrained motion. Remove browser-only RSVP behavior because no RSVP requirement was supplied for these events.

### 5. Ministries and Bible College
- Preserve the seven established ministry categories, but remove blank placeholder descriptions rather than invent category-specific programmes or claims.
- Add a spiritually grounded introduction focused on fellowship, service, worship, and belonging, with an enquiry link to `info@seedofchrist.org`.
- Replace the Bible College placeholders with a polished factual landing section for **Seed of Christ Golden Church Land of Reality Worldwide Bible College**, describing its established teaching, discipleship, and biblical-learning purpose without adding courses, accreditation, fees, requirements, duration, staff, or statistics.
- Add the same confirmed enquiry address.

### 6. Preserve confirmed content
- Keep the leadership page limited to Apostle Dr. S.M.O. Mustapha JP and Prophetess Eunice Mustapha, with their supplied portraits and the exact workforce directory link.
- Preserve the established History & Beliefs copy.
- Keep sermons and prayer-session media in the official Church App, with the exact existing store URLs and branded badges.
- Preserve branch data, forms, app links, photography, accessibility labels, metadata, robots, and sitemap behavior unless a visual adjustment is required.

### 7. Framework-correct Netlify readiness
- This repository is **TanStack Start with React 19 and Vite/Nitro**, not Next.js 14. Do not add `.next`, `next build`, OpenNext, or Next.js rewrites because they would break this project.
- Configure Nitro for Netlify, add a minimal `netlify.toml` using the existing package manager and actual output, and add/verify `dev`, `build`, and `start` scripts appropriate to this project.
- Keep generated output, local environment files, secrets, and credentials excluded from source control.
- No map secret will be required because Leaflet/OpenStreetMap is used.
- Validate the harness production build and inspect the emitted Netlify output before finalizing paths.

## Verification
- Test desktop (1280px), tablet (768px), and mobile (390px) with Playwright.
- Verify map rendering, marker/list selection, responsive behavior, filtering, search, alphabetical order, UK handling, and absence of map/hydration/console errors.
- Verify all six events, second-by-second countdown movement, rollover logic, and date calculations around month/year boundaries, February, and leap years.
- Verify Ministries, Bible College, leadership, workforce link, Sermons/App flow, exact app-store URLs, navigation, image loading, no horizontal overflow, metadata, and keyboard focus.
- Check the latest automated build result and resolve all reported errors.

## Deployment note to provide
After validation, provide concise GitHub-to-Netlify steps using the framework settings committed in the repository, plus environment-variable guidance if any existing integrations require configuration.
