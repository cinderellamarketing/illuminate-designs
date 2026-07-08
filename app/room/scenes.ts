// Scene config for /room — the standalone sample session.
//
// This page holds video *references* only. No video files live in the repo
// or in /public; each footage beat streams adaptively from a video host
// (Mux by default) as HLS. To drop real footage in, paste the playback id
// into a beat's `source` below — nothing else changes. SessionVideo resolves
// it to an HLS stream, lazy-loads it near the viewport, plays one clip at a
// time, and releases it as the beat scrolls away.
//
// Host-agnostic by design. `source` is either a Mux playback id OR a full
// HLS (.m3u8) URL, so a Cloudflare Stream / Bunny / self-hosted HLS clip
// works with no code change — paste its .m3u8 URL. If a host needs a
// different id-to-URL rule, `hlsUrl()` below is the single line to change.

import type { MediaClip } from "@/lib/media";

export type Scene = {
  // Stable id, doubling as the footage brief (what to shoot / pick). Not
  // shown to visitors.
  id: string;
  // Empty until footage is chosen. A Mux playback id, or a full HLS URL.
  source: string;
  // A poster still that paints instantly. Placeholder now (session stills
  // already in /public); swap for the chosen frame or a Mux thumbnail
  // (https://image.mux.com/<PLAYBACK_ID>/thumbnail.jpg) when footage lands.
  poster: string;
  // One line under / over the footage. SLOT captions are labelled
  // placeholders on the page until the footage is locked.
  caption: string;
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
    poster: scene.poster,
    caption: scene.caption,
    context: scene.id,
  };
}

export const scenes = {
  // Beat 1 — Enter. Full-bleed establishing shot, trainer mid-session.
  enter: {
    id: "TRAINER_WIDE",
    // TODO: paste Mux playback id — TRAINER_WIDE (room establishing, trainer mid-session)
    source: "",
    poster: "/poster-heroWide.jpg",
    caption: "",
  },

  // Beat 2 — The room before. A single quiet still, lights low. Footage is
  // optional here; a still carries it.
  before: {
    id: "ROOM_BEFORE",
    // TODO (optional): a quiet still is enough for this beat; footage not required.
    source: "",
    poster: "/poster-heroWide.jpg",
    caption: "",
  },

  // Beat 3 — Training beat one. Contained frame, caption beneath.
  taskOnScreen: {
    id: "TASK_ON_SCREEN_1",
    // TODO: paste Mux playback id — TASK_ON_SCREEN_1 (a real task worked through on screen)
    source: "",
    poster: "/poster-detail.jpg",
    // SLOT — plain example to finalise with footage.
    caption: "Turning a real task into ten minutes of work.",
  },

  // Beat 5 — Training beat two. Video one side, one line the other.
  learnerReaction: {
    id: "LEARNER_REACTION",
    // TODO: paste Mux playback id — LEARNER_REACTION (the moment it lands for someone)
    source: "",
    poster: "/poster-facesClose.jpg",
    // SLOT — the moment it lands for someone in the room.
    caption: "The moment it lands for someone in the room.",
  },

  // Beat 8 — How it sticks. Delivery and follow-up. Visual-led.
  followUp: {
    id: "SMALL_GROUP", // or FOLLOWUP
    // TODO: paste Mux playback id — SMALL_GROUP or FOLLOWUP (small-group delivery / follow-up)
    source: "",
    poster: "/poster-presenting.jpg",
    // SLOT — set with footage.
    caption: "",
  },
} satisfies Record<string, Scene>;
