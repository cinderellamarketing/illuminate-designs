"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaClip } from "@/lib/media";

type Variant = "hero" | "scene" | "reel" | "portrait" | "fill";

type SessionVideoProps = {
  clip: MediaClip;
  variant?: Variant;
  // Hero clips show an unmute affordance. Other variants do not.
  showMuteToggle?: boolean;
  className?: string;
  // Override the placeholder label
  label?: string;
  // How the media fills its frame. `contain` keeps an honest screen
  // recording whole — never cropped or stretched — letterboxing into the
  // charcoal frame if the aspect differs. `cover` (default) fills the frame
  // and is kept for the ambient /session footage.
  fit?: "cover" | "contain";
  // Lazy-load: only mount video element when within viewport (cheap).
  eager?: boolean;
  // When true, the clip waits for hover/focus before playing on devices
  // that support hover. Touch devices fall back to autoplay. (unmanaged)
  playOnHover?: boolean;
  // Managed lifecycle for the /room sample session: streams HLS from
  // clip.src, plays one clip at a time, pauses and releases as it leaves
  // the viewport, and falls back to tap-to-play on mobile or when
  // prefers-reduced-data / prefers-reduced-motion is set.
  managed?: boolean;
  // The reel index shown in the placeholder's timecode detail (01, 02, ...),
  // so sibling frames read as a sequence rather than all "reel · 01".
  reelNo?: number;
};

// Shared: the aspect-ratio class for a variant. hero / fill are sized by
// the parent, everything else carries its own ratio.
function aspectClass(variant: Variant) {
  return variant === "portrait"
    ? "aspect-[3/4]"
    : variant === "reel"
      ? "aspect-[4/3]"
      : variant === "scene"
        ? "aspect-[16/9]"
        : "";
}

// Eager <img> poster that paints a frame instantly, even before the
// <video> mounts (lazy variants) or finishes its first request. The video,
// once playing, paints over it.
function PosterLayer({
  clip,
  eager,
  errored,
  fit = "cover",
}: {
  clip: MediaClip;
  eager: boolean;
  errored: boolean;
  fit?: "cover" | "contain";
}) {
  if (!clip.poster || errored) return null;
  return (
    <img
      src={clip.poster}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${
        fit === "contain" ? "object-contain" : "object-cover"
      }`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export function SessionVideo(props: SessionVideoProps) {
  // The managed lifecycle is a distinct enough machine that it lives in its
  // own component; /session keeps the original, untouched path.
  return props.managed ? (
    <ManagedVideo {...props} />
  ) : (
    <PlainVideo {...props} />
  );
}

/* ---------------- Unmanaged (self-hosted mp4, used on /session) ---------- */

function PlainVideo({
  clip,
  variant = "scene",
  showMuteToggle = false,
  className = "",
  label,
  eager = false,
  playOnHover = false,
  fit = "cover",
  reelNo = 1,
}: SessionVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [errored, setErrored] = useState(false);
  const [inView, setInView] = useState(eager);
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    if (!playOnHover || typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setSupportsHover(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [playOnHover]);

  const hoverGated = playOnHover && supportsHover;
  const shouldAutoPlay = !hoverGated;

  const handlePlay = () => {
    if (!hoverGated) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  };
  const handlePause = () => {
    if (!hoverGated) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  // Mount when near viewport to keep things light.
  useEffect(() => {
    if (eager) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  const showVideo = !!clip.src && !errored && inView;
  const labelText = label ?? "Session footage to follow";

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden bg-[#0b0a08] text-[#f4ede0] ${aspectClass(variant)} ${className}`}
      onMouseEnter={handlePlay}
      onMouseLeave={handlePause}
      onFocus={handlePlay}
      onBlur={handlePause}
    >
      <PosterLayer clip={clip} eager={eager} errored={errored} fit={fit} />
      {showVideo ? (
        <video
          ref={videoRef}
          src={clip.src!}
          autoPlay={shouldAutoPlay}
          muted={muted}
          loop
          playsInline
          preload={eager ? "auto" : "metadata"}
          poster={clip.poster}
          onError={() => setErrored(true)}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
          className={`absolute inset-0 h-full w-full ${
            fit === "contain" ? "object-contain" : "object-cover"
          }`}
        />
      ) : !clip.src || errored ? (
        <Placeholder label={labelText} variant={variant} reelNo={reelNo} />
      ) : null}

      {/* Darkening over the hero video for legibility of overlay content. */}
      {showVideo && variant === "hero" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.50) 60%, rgba(0,0,0,0.70) 100%)",
          }}
        />
      )}

      {showMuteToggle && showVideo && (
        <MuteToggle
          muted={muted}
          onToggle={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
          }}
        />
      )}
    </div>
  );
}

/* ---------------- Managed (adaptive HLS, used on /room) ------------------ */

// Only one managed clip plays at a time across the whole page. Starting a
// clip pauses whoever held the slot. Kept module-level so every managed
// SessionVideo shares one "now playing" position.
type ActiveEntry = { pause: () => void };
let activeEntry: ActiveEntry | null = null;
function claimActive(entry: ActiveEntry) {
  if (activeEntry && activeEntry !== entry) activeEntry.pause();
  activeEntry = entry;
}
function releaseActive(entry: ActiveEntry) {
  if (activeEntry === entry) activeEntry = null;
}

type Connection = { saveData?: boolean };

function ManagedVideo({
  clip,
  variant = "fill",
  showMuteToggle = false,
  className = "",
  label,
  eager = false,
  fit = "cover",
  reelNo = 1,
}: SessionVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);
  const [muted, setMuted] = useState(true);
  const [errored, setErrored] = useState(false);
  const [near, setNear] = useState(eager); // mount <video> when near viewport
  const [playing, setPlaying] = useState(false);
  const [tapToPlay, setTapToPlay] = useState(false); // require a tap, no autoplay
  const [tapped, setTapped] = useState(false); // visitor asked to play

  // Stable coordinator slot so another clip starting can pause this one.
  // Created once via the state initialiser; the closure reads videoRef at
  // call time, never during render.
  const [slot] = useState<ActiveEntry>(() => ({
    pause: () => {
      const v = videoRef.current;
      if (v) {
        try {
          v.pause();
        } catch {}
      }
      setPlaying(false);
    },
  }));

  const src = clip.src;
  const hasVideo = !!src && !errored;

  // On mobile, or with reduced-data / reduced-motion / Save-Data, we never
  // autoplay: the poster stays and the visitor taps to play.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const queries = [
      window.matchMedia("(max-width: 767px)"),
      window.matchMedia("(prefers-reduced-data: reduce)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    const saveData = () =>
      !!(navigator as Navigator & { connection?: Connection }).connection
        ?.saveData;
    const update = () => setTapToPlay(queries.some((q) => q.matches) || saveData());
    update();
    queries.forEach((q) => q.addEventListener?.("change", update));
    return () => queries.forEach((q) => q.removeEventListener?.("change", update));
  }, []);

  // Mount the <video> when the wrapper nears the viewport; unmount it again
  // once it scrolls well away, releasing the stream and decoder. Eager
  // clips (the hero) start mounted so their first frame is ready.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setNear(entry.isIntersecting || eager);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  // Attach the source once the element is mounted and near. Safari / iOS
  // play the .m3u8 natively; everywhere else we lazily import hls.js — so
  // it only ever loads for a clip that needs it, and never while
  // sources are still empty. A plain file (mp4) just sets src.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src || !near) return;

    const isHls = src.includes(".m3u8");
    if (!isHls || v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = src;
      return () => {
        v.removeAttribute("src");
        try {
          v.load();
        } catch {}
      };
    }

    let cancelled = false;
    import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled || !videoRef.current) return;
        if (!Hls.isSupported()) {
          v.src = src;
          return;
        }
        const hls = new Hls({ capLevelToPlayerSize: true, maxBufferLength: 20 });
        hlsRef.current = hls;
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data?.fatal) setErrored(true);
        });
        hls.loadSource(src);
        hls.attachMedia(v);
      })
      .catch(() => setErrored(true));

    return () => {
      cancelled = true;
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch {}
        hlsRef.current = null;
      }
    };
  }, [src, near]);

  // Drive playback from the clip's own visibility. On autoplay-capable
  // devices a clip plays once it is the one on screen (>= 55% visible) and
  // pauses + releases the slot as it leaves. In tap-to-play mode it waits
  // for the visitor, then follows the same pause-on-exit rule. Either way,
  // starting a clip pauses the previous one via the shared slot.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasVideo || !near || typeof IntersectionObserver === "undefined")
      return;

    const start = () => {
      claimActive(slot);
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    };
    const stop = () => {
      try {
        v.pause();
      } catch {}
      releaseActive(slot);
      setPlaying(false);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const onScreen =
            entry.isIntersecting && entry.intersectionRatio >= 0.55;
          if (onScreen) {
            if (!tapToPlay || tapped) start();
          } else {
            stop();
          }
        }
      },
      { threshold: [0, 0.55, 0.9] },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      stop();
    };
  }, [hasVideo, near, tapToPlay, tapped, slot]);

  const requestTapPlay = () => {
    setTapped(true);
    const v = videoRef.current;
    if (!v) return;
    claimActive(slot);
    v.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  };

  const showVideo = hasVideo && near;
  const showTapButton = hasVideo && tapToPlay && !playing;

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden bg-[#0b0a08] text-[#f4ede0] ${aspectClass(variant)} ${className}`}
    >
      <PosterLayer clip={clip} eager={eager} errored={errored} fit={fit} />

      {showVideo && (
        <video
          ref={videoRef}
          muted={muted}
          loop
          playsInline
          preload="none"
          poster={clip.poster}
          onError={() => setErrored(true)}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
          className={`absolute inset-0 h-full w-full ${
            fit === "contain" ? "object-contain" : "object-cover"
          }`}
        />
      )}

      {/* Hero legibility scrim, only while the video is painting. */}
      {showVideo && playing && variant === "hero" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.34) 45%, rgba(0,0,0,0.62) 100%)",
          }}
        />
      )}

      {/* Tap to play (mobile / reduced-data / reduced-motion). */}
      {showTapButton && (
        <button
          type="button"
          onClick={requestTapPlay}
          aria-label={`Play ${label ?? "session footage"}`}
          className="group absolute inset-0 z-20 flex items-center justify-center"
        >
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-sm transition group-hover:bg-black/60 group-focus-visible:bg-black/60"
          >
            <svg
              width="20"
              height="22"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-[3px]"
            >
              <path
                d="M17 9.13397C17.6667 9.51887 17.6667 10.4811 17 10.866L2 19.5263C1.33333 19.9112 0.5 19.4301 0.5 18.6603L0.5 1.33975C0.5 0.569947 1.33333 0.0888217 2 0.473722L17 9.13397Z"
                fill="#f55e09"
                fillOpacity="0.95"
              />
            </svg>
          </span>
        </button>
      )}

      {/* Styled placeholder only when there is nothing to paint. */}
      {!hasVideo && !clip.poster && (
        <Placeholder
          label={label ?? "Session footage to follow"}
          variant={variant}
          reelNo={reelNo}
        />
      )}

      {showMuteToggle && showVideo && playing && (
        <MuteToggle
          muted={muted}
          onToggle={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
          }}
        />
      )}
    </div>
  );
}

/* ---------------- Shared UI ---------------- */

function MuteToggle({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="pointer-events-auto absolute bottom-5 right-5 z-30 flex items-center gap-2 rounded-md border border-white/25 bg-black/30 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.02em] text-white backdrop-blur transition hover:bg-black/50"
      aria-pressed={!muted}
      aria-label={muted ? "Unmute session footage" : "Mute session footage"}
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: muted ? "#f9a71d" : "#f55e09" }}
      />
      {muted ? "Unmute" : "Mute"}
    </button>
  );
}

function Placeholder({
  label,
  variant,
  reelNo = 1,
}: {
  label: string;
  variant: Variant;
  reelNo?: number;
}) {
  return (
    <div className="absolute inset-0">
      {/* Warm light pool gives the panel depth, consistent with the room. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 35% 25%, #241c13 0%, #16120d 55%, #0b0907 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 35% 30%, rgba(249,167,29,0.12) 0%, rgba(13,11,9,0) 60%)",
        }}
      />

      {/* Centre play affordance. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          aria-hidden
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 backdrop-blur-sm"
          style={{ background: "rgba(245,94,9,0.1)" }}
        >
          <svg
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-[3px]"
          >
            <path d="M17 9.13397C17.6667 9.51887 17.6667 10.4811 17 10.866L2 19.5263C1.33333 19.9112 0.5 19.4301 0.5 18.6603L0.5 1.33975C0.5 0.569947 1.33333 0.0888217 2 0.473722L17 9.13397Z" fill="#f55e09" fillOpacity="0.9" />
          </svg>
        </div>
      </div>

      {/* Top-left small label. */}
      <div className="absolute left-4 top-4 font-mono text-[10.5px] tracking-[0.04em] text-white/70">
        {variant === "portrait" ? "Portrait to follow" : label}
      </div>

      {/* Bottom-right timecode-style detail to feel intentional. */}
      <div className="absolute bottom-4 right-4 font-mono text-[10.5px] tracking-[0.04em] text-white/45">
        reel · {String(reelNo).padStart(2, "0")}
      </div>
    </div>
  );
}
