// Framed video slots for /channel — Ed's clips.
//
// Host-agnostic, Mux assumed. Paste a Mux playback id (or a full HLS .m3u8
// URL) into a slot's `source` to go live; nothing else changes. Until then
// each slot paints the styled placeholder panel and the page works fully.
//
// SessionVideo streams these managed, exactly like /room: poster-first,
// lazy-loaded near the viewport, muted, and only one clip plays at a time
// across the whole page.
//
// Changing video host is a one-line change in hlsUrl().

import type { MediaClip } from "@/lib/media";

export type ChannelVideo = {
  // Stable slot id. Doubles as the footage brief. Not shown to visitors.
  id: string;
  // A Mux playback id, or a full HLS URL. Empty until footage lands.
  source: string;
  // A poster still that paints instantly. Empty renders the styled
  // placeholder panel; later, a Mux thumbnail
  // (https://image.mux.com/<PLAYBACK_ID>/thumbnail.jpg) or a chosen frame.
  poster: string;
  // Small mono label shown on the frame.
  label: string;
};

// Resolve a `source` into a playable HLS URL, or null when still empty.
//   - a full URL, or anything containing `.m3u8`, is used as-is
//     (Cloudflare Stream, Bunny, self-hosted, …)
//   - anything else is treated as a Mux playback id
export function hlsUrl(source: string): string | null {
  const s = source.trim();
  if (!s) return null;
  if (s.startsWith("http") || s.includes(".m3u8")) return s;
  return `https://stream.mux.com/${s}.m3u8`;
}

// Adapt a slot into the MediaClip shape SessionVideo consumes. `src` is null
// while `source` is empty, so SessionVideo paints the placeholder only and
// the page works fully today.
export function toClip(video: ChannelVideo): MediaClip {
  return {
    id: video.id,
    src: hlsUrl(video.source),
    poster: video.poster || undefined,
    caption: video.label,
    context: video.id,
  };
}

export const channelVideos = {
  edd_intro: {
    id: "edd_intro",
    // TODO: paste Mux playback id — Ed on how he works with the channel
    source: "",
    poster: "",
    label: "Ed on how he works with the channel",
  },
  edd_sales_enablement: {
    id: "edd_sales_enablement",
    // TODO: paste Mux playback id — Ed on sales enablement
    source: "",
    poster: "",
    label: "Ed on sales enablement",
  },
  edd_partnership: {
    id: "edd_partnership",
    // TODO: paste Mux playback id — Ed on the TD SYNNEX partnership
    source: "",
    poster: "",
    label: "Ed on the partnership",
  },
} satisfies Record<string, ChannelVideo>;
