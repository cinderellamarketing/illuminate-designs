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
- `next/font/google`, three roles: Archivo (display grotesque, variable, wide + heavy), Hanken Grotesk (body/UI), IBM Plex Mono (labels, the stat readout, data). No serif.
- App Router `sitemap.ts` / `robots.ts` / per-route `metadata`.

## Design language: lit-dark room

Content sits in warm pools of light on a dark engineered ground, like a training room with the lights on. Emphasis comes from weight, scale and an orange accent, never from an italic serif clause. The 82% stat is a mono gauge (`StatMeter`) with the 30 to 82 count-up and an industry-30 baseline tick. Buttons are engineered (`.btn`, squared, sentence case, orange fill / hairline outline). The whole light system and every easter egg are untouched.

## Footage and media

All footage references live in `lib/media.ts`. The hero clip on both routes uses a single neutral royalty-free placeholder so autoplay and unmute are real and testable. Every other slot renders the styled `SessionVideo` placeholder panel (dark, warm-lit, with a small mono label and play affordance) until real session footage is delivered. Swapping in real clips later means editing only `lib/media.ts`.

## Brand tokens

Defined in `app/globals.css` under `@theme`:

```
--color-brand-orange: #f55e09   /* the light source, primary CTA */
--color-brand-amber:  #f9a71d   /* secondary glow */
--color-ground:       #0d0b09   /* base canvas */
--color-surface:      #16120d   /* raised panels */
--color-surface-2:    #1f1913   /* further raised, hover */
--color-text:         #f4ede0   /* primary text on dark */
--color-text-muted:   rgba(244,237,224,0.62)
--color-hairline:     rgba(244,237,224,0.12)
```

Use the Tailwind utilities `bg-ground`, `bg-surface`, `text-text`, `text-text-muted`, `border-hairline`, `bg-brand-orange` and so on.

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
  globals.css             Tailwind import + @theme tokens + light system + buttons
  _components/
    SessionVideo.tsx      reusable footage/placeholder component
    StatMeter.tsx         the 82% mono gauge (count-up + baseline tick)
  session/                /session route
  room/                   /room route
  robots.ts
  sitemap.ts
lib/
  fonts.ts                next/font/google: Archivo + Hanken Grotesk + IBM Plex Mono
  copy.ts                 shared body copy
  media.ts                single media manifest
```

## Rules followed

- Three roles only: Archivo (display), Hanken Grotesk (body/UI), IBM Plex Mono (data). No serif, no Newsreader.
- Dark engineered ground with resting warm light pools. No cream paper base, no film grain.
- Emphasis by weight, scale and an orange accent. No italic-amber clause, no eyebrow-dot labels, no rounded-full uppercase pills.
- No em dashes in copy. British English throughout.
