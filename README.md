# Illuminate Learning — In the room

Two homepage directions for Illuminate Learning, a Microsoft Copilot training company based in Pembrokeshire. Both are built around the same idea: the visitor is in the room of a live training session.

## Routes

| Route       | Direction                       | Notes                                                                                       |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| `/`         | Two-direction index             | One-line description of each direction and a clear link through.                            |
| `/session`  | Distinctive but converts        | Recognisably a website. Clear nav, persistent booking CTA. Footage does the heavy lifting.  |
| `/room`     | Experimental, accepts risk     | Scroll-driven, cinematic. Lands mid-session, the 82% number reveals through motion.         |

## Stack

- Next.js App Router with React 19 (Next 16).
- TypeScript, strict.
- Tailwind v4 (CSS-first config via `@theme` in `app/globals.css`).
- Framer Motion for scroll-driven motion.
- `next/font/google` for Newsreader (display serif) and Hanken Grotesk (UI).
- App Router `sitemap.ts` / `robots.ts` / per-route `metadata`.

## Footage and media

All footage references live in `lib/media.ts`. The hero clip on both routes uses a single neutral royalty-free placeholder so autoplay and unmute are real and testable. Every other slot renders the styled `SessionVideo` placeholder panel (dark, grainy, with a small label and play affordance) until real session footage is delivered. Swapping in real clips later means editing only `lib/media.ts`.

## Brand tokens

Defined in `app/globals.css` under `@theme`:

```
--color-brand-orange: #f55e09
--color-brand-amber:  #f9a71d
--color-paper:        #f4ede0
--color-ink:          #0b0a08
```

Use the Tailwind utilities `bg-brand-orange`, `bg-paper`, `text-ink` and so on.

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

## Deploy to Vercel

```bash
# one-off, requires the CLI: npm i -g vercel
vercel link
vercel          # preview deploy
vercel --prod   # production deploy
```

The branch `concept/in-the-room` opens a PR against `main`, which gives Vercel a preview URL before merging.

## Project structure

```
app/
  layout.tsx              root layout, loads font variables
  page.tsx                /index, the two directions
  globals.css             Tailwind import + @theme tokens + film grain
  _components/
    SessionVideo.tsx      reusable footage/placeholder component
  session/                /session route
  room/                   /room route
  robots.ts
  sitemap.ts
lib/
  fonts.ts                next/font/google: Newsreader + Hanken Grotesk
  copy.ts                 shared body copy
  media.ts                single media manifest
```

## Rules followed

- No Inter, Space Grotesk, Roboto, Fraunces, or system fonts.
- No hero with headline-left, visual-right split.
- No "trusted by" logo wall, no three-card feature grid, no testimonial slider.
- No bento grids, no floating product screenshots, no abstract 3D shapes.
- No em dashes in copy. British English throughout.
