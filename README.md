# karya-site

Marketing site for Karya, built from the Claude Design project (Landing v3, Docs, Roadmap).

## Run

```
npm install
npm run dev      # http://localhost:3400
npm run build && npm run start
```

## Structure

- `app/page.tsx` – landing (`components/Landing.tsx`)
- `app/docs/page.tsx` – getting started
- `app/roadmap/page.tsx` – MVP vs deferred
- `components/` – SiteNav (theme toggle), SiteFooter, Terminal (animated / final / static replica), ApprovalCard, EnvTable
- `app/globals.css` – colour tokens for dark and light, hover classes

Fonts are loaded with `next/font/google` (IBM Plex Mono, Newsreader). Theme is stored in `localStorage` under `karya-theme`.
