<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep website message and prayer-session content in the official Church App rather than duplicating it on web pages, because the app is the maintained media destination.
- Use Leaflet with OpenStreetMap and verified locality coordinates for branch mapping; this avoids browser secrets and prevents invented precise locations.
- Target self-hosted production builds through Nitro's Netlify preset; this preserves TanStack Start server rendering and file-based routes.
- Store testimony submissions in Lovable Cloud with public reads limited to published records; this preserves moderation and keeps contact details private.
