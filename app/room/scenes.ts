// Beat manifest for /room — the standalone sample session.
//
// One entry per beat, in scroll order. This file is the single source of
// truth for the page: its ids, kinds and captions drive RoomPage. Ten beats
// alternate lights-on working beats (the screen recordings) with lights-off
// quiet beats (a still, the two proof lines, the number).
//
// The footage is an honest artifact: each clip is the Microsoft 365 Copilot
// app on screen with a rail of participant camera tiles down the right. It is
// framed cleanly inside the dark room and never cropped, stretched or
// overlaid — the teaching in the app carries the beat.
//
// Video files never live in the repo or in /public. Each clip streams
// adaptively from a video host (Mux by default) as HLS. To drop real footage
// in, paste the playback id into a beat's `source` below — nothing else
// changes. SessionVideo resolves it to an HLS stream, lazy-loads it near the
// viewport, plays one clip at a time, and releases it as the beat scrolls
// away. Until a `source` is set, the beat paints its poster still and works
// fully.
//
// Host-agnostic by design. `source` is either a Mux playback id OR a full
// HLS (.m3u8) URL, so a Cloudflare Stream / Bunny / self-hosted clip works
// with no code change. If a host needs a different id-to-URL rule, `hlsUrl()`
// below is the single line to change.

import type { MediaClip } from "@/lib/media";

export type SceneKind = "clip" | "poster" | "quote" | "number" | "cta";

export type Scene = {
  // Exact beat id from the brief. Stable, and doubles as the footage brief
  // (what to shoot / pick). Not shown to visitors.
  id: string;
  kind: SceneKind;
  // Empty until footage is chosen. A Mux playback id, or a full HLS URL.
  // Only `clip` beats stream video; the rest leave this empty.
  source: string;
  // A poster still that paints instantly. Placeholder session stills for
  // now (already in /public); swap for the chosen frame or a Mux thumbnail
  // (https://image.mux.com/<PLAYBACK_ID>/thumbnail.jpg) when footage lands.
  poster: string;
  // The beat's line, exactly as written in the brief. Proof beats stay
  // empty until a real quote is cleared — nothing is invented.
  caption: string;
  // Optional supporting mono line (scroll cue, proof slot note).
  note?: string;
  // Only the close beat carries a CTA.
  cta?: { label: string; href: string };
};

// Resolve a `source` into a playable HLS URL, or null when still empty.
//   - a full URL, or anything containing `.m3u8`, is used as-is
//     (Cloudflare Stream, Bunny, self-hosted, …)
//   - anything else is treated as a Mux playback id
// Changing video host is a one-line change here.
export function hlsUrl(source: string): string | null {
  const s = source.trim();
  if (!s) return null;
  if (s.startsWith("http") || s.includes(".m3u8")) return s;
  return `https://stream.mux.com/${s}.m3u8`;
}

// Adapt a Scene into the MediaClip shape SessionVideo consumes. `src` is
// null while `source` is empty, so SessionVideo paints the poster only and
// the page works fully today against placeholder stills.
export function toClip(scene: Scene): MediaClip {
  return {
    id: scene.id,
    src: hlsUrl(scene.source),
    poster: scene.poster || undefined,
    caption: scene.caption,
    context: scene.id,
  };
}

export const scenes = {
  // 1 — Enter. Full-bleed framed recording, lights coming up.
  enter: {
    id: "enter",
    kind: "clip",
    // TODO: paste Mux playback id — enter (room establishing, the session starting)
    source: "",
    poster: "/poster-heroWide.jpg",
    caption: "Take a seat. The session's starting.",
    note: "Scroll to begin",
  },

  // 2 — The gap. Lights low, sparse, mostly dark. A still carries it; no
  // footage required here.
  gap: {
    id: "gap",
    kind: "poster",
    source: "",
    poster: "/poster-heroWide.jpg",
    caption: "Nearly everyone here has a licence. Most have barely opened it.",
  },

  // 3 — Method. Contained framed recording, caption beneath.
  method: {
    id: "method",
    kind: "clip",
    // TODO: paste Mux playback id — method (teaching the frame: goal, context, source, expectations)
    source: "",
    poster: "/poster-facesClose.jpg",
    caption: "How they teach it: goal, context, source, expectations.",
  },

  // 4 — Proof one. A single client line, lit in the dark. Empty until
  // cleared. No invented quote.
  proofMcpin: {
    id: "proof_mcpin",
    kind: "quote",
    source: "",
    poster: "",
    caption: "",
    note: "Client line, added once cleared to share.",
  },

  // 5 — Task. Different framing from the method beat. One real task, worked
  // start to finish.
  task: {
    id: "task",
    kind: "clip",
    // TODO: paste Mux playback id — task (one real task, worked start to finish)
    source: "",
    poster: "/poster-heroWide.jpg",
    caption: "One real task, start to finish.",
  },

  // 6 — Security. The green shield explained on screen.
  security: {
    id: "security",
    kind: "clip",
    // TODO: paste Mux playback id — security (what the green shield protects)
    source: "",
    poster: "/poster-facesClose.jpg",
    caption: "What the green shield protects.",
  },

  // 7 — The number. Stated plainly as a quiet caption beat, no gauge. The
  // 82-against-30 stat carries its one gauge on the /session hero.
  number: {
    id: "number",
    kind: "number",
    source: "",
    poster: "",
    caption: "82% adoption in eight weeks. The industry sits near 30%.",
  },

  // 8 — Value. Turning time saved into money.
  value: {
    id: "value",
    kind: "clip",
    // TODO: paste Mux playback id — value (saving an hour vs making money)
    source: "",
    poster: "/poster-heroWide.jpg",
    caption: "Saving an hour is not the same as making money.",
  },

  // 9 — Proof two. Another client line, lit in the dark. Empty until
  // cleared. No invented quote.
  proofLymphoma: {
    id: "proof_lymphoma",
    kind: "quote",
    source: "",
    poster: "",
    caption: "",
    note: "Client line, added once cleared to share.",
  },

  // 10 — Close. Lights up fully. One primary CTA. Nav and footer carry the
  // visitor on into the rest of the site.
  close: {
    id: "close",
    kind: "cta",
    source: "",
    poster: "",
    caption: "That's a session. Book one for your team.",
    cta: { label: "Book a session", href: "/contact" },
  },
} satisfies Record<string, Scene>;
