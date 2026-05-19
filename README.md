# Illuminate Learning — Design study

Three homepage directions for Illuminate Learning, a Microsoft Copilot training company. Same eight sections in every variant, same body copy, three very different voices. A cursor-tracked spotlight wordmark sits in every footer; each variant interprets it differently.

## Routes

| Route          | Direction   | Voice                                                                                          |
| -------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `/`            | Index       | Thumbnails and nav across the three variants.                                                  |
| `/editorial`   | Editorial   | Cream paper, Fraunces + Public Sans. Pentagram × Monocle. Quiet, asymmetric, paper grain.      |
| `/studio`      | Studio      | Alternating cream and obsidian. Bricolage Grotesque + Instrument Serif. Blend-mode cursor, magnetic CTAs, hero spotlight, count-up. |
| `/cinema`      | Cinema      | Near-black canvas. Instrument Serif italic at huge scale. Global cursor "torch" reveals the words. Aggressive on purpose.            |

## Stack

- Next.js App Router with React 19 (the project was scaffolded with `create-next-app`; the latest stable line at scaffold time was Next 16, and the App Router conventions match the Next 15 spec).
- TypeScript, strict.
- Tailwind v4 (CSS-first config via `@theme` in `app/globals.css`).
- Framer Motion for animations.
- `next/font/google` for Fraunces, Public Sans, Bricolage Grotesque, Instrument Serif, IBM Plex Mono and IBM Plex Sans.
- App Router `sitemap.ts` / `robots.ts` / per-route `metadata`.
- Static export on every page (each route prerenders).

## Brand tokens

Defined in `app/globals.css` under `@theme`:

```
--color-brand-orange: #f55e09
--color-brand-amber:  #f9a71d
--color-paper-editorial: #f6efe2
--color-ink-editorial:   #15110d
--color-paper-studio:    #f4ede0
--color-obsidian-studio: #0c0a08
--color-cinema-bg:    #050505
--color-cinema-warm:  #f5f0e8
--color-cinema-dim:   #2a2622
```

Use the Tailwind utilities `bg-brand-orange`, `text-paper-editorial` and so on.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Production build

```bash
npm run build
npm start
```

Every route renders statically — no runtime data fetching. Lighthouse should score 90+ on Performance and SEO out of the box.

## Touch and reduced motion

- All cursor-tracked effects (blend-mode cursor, spotlight reveal, magnetic CTAs, cinema torch) check `(hover: none), (pointer: coarse)` and fall back gracefully on touch. On `/cinema` the dim layer is replaced with the bright layer so the page is fully readable.
- `prefers-reduced-motion: reduce` collapses animation durations across the site.

## Deploy to Vercel

The repo is at <https://github.com/cinderellamarketing/illuminate-designs>.

```bash
# one-off, requires the CLI: npm i -g vercel
vercel link
vercel          # preview deploy
vercel --prod   # production deploy
```

Or import the GitHub repo at <https://vercel.com/new>. Every push to `main` becomes a preview, the main branch is the production deployment, and pull requests get their own preview URL.

There is no custom infrastructure — Vercel will detect Next.js automatically.

## Project structure

```
app/
  layout.tsx          root layout, loads every font variable
  page.tsx            /index, three thumbnails
  globals.css         Tailwind import + @theme tokens + paper grain
  editorial/page.tsx  /editorial
  studio/page.tsx     /studio
  cinema/page.tsx     /cinema (TorchReveal, PillarNode, CinemaWordmark)
  robots.ts
  sitemap.ts
lib/
  fonts.ts            next/font/google setup with variable axes
  copy.ts             shared body copy (so all three variants stay in sync)
  useIsTouch.ts       small media-query hook
```

## Rules followed

- No Inter, no Space Grotesk, no Roboto, no system fonts.
- No purple gradients, no glassmorphism, no generic bento grids, no floating orbs, no "trusted by" carousel cliché.
- No em dashes in copy.
- British English throughout.

## Authoring notes

- Body copy lives in `lib/copy.ts`. Editing it once updates all three variants.
- The paper grain on `/editorial` is an inline SVG noise filter on the `.paper-grain` class — no asset to ship.
- The cinema `TorchReveal` is the file to read if you want to understand how the torch effect works. It renders each fragment twice — a dim base in `text-cinema-dim` and a bright copy in `text-cinema-warm` (or orange), masked by a `radial-gradient` mask whose centre is the cursor.
