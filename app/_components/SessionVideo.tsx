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
  // Lazy-load: only mount video element when within viewport (cheap).
  eager?: boolean;
  // When true, the clip waits for hover/focus before playing on devices
  // that support hover. Touch devices fall back to autoplay.
  playOnHover?: boolean;
};

export function SessionVideo({
  clip,
  variant = "scene",
  showMuteToggle = false,
  className = "",
  label,
  eager = false,
  playOnHover = false,
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

  const aspect =
    variant === "portrait"
      ? "aspect-[3/4]"
      : variant === "reel"
        ? "aspect-[4/3]"
        : variant === "scene"
          ? "aspect-[16/9]"
          : ""; // hero / fill: parent controls sizing

  const labelText = label ?? "Session footage to follow";

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden bg-[#0b0a08] text-[#f4ede0] ${aspect} ${className}`}
      onMouseEnter={handlePlay}
      onMouseLeave={handlePause}
      onFocus={handlePlay}
      onBlur={handlePause}
    >
      {clip.poster && !errored && (
        // Eager <img> poster shows a frame instantly, even before the
        // <video> element mounts (lazy variants) or finishes its initial
        // request. The video, once playing, paints over it.
        <img
          src={clip.poster}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      )}
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
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : !clip.src || errored ? (
        <Placeholder label={labelText} variant={variant} />
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
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
          }}
          className="font-ui pointer-events-auto absolute bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-black/50"
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
      )}
    </div>
  );
}

function Placeholder({ label, variant }: { label: string; variant: Variant }) {
  return (
    <div className="film-grain absolute inset-0">
      {/* Subtle gradient gives the panel depth, not flat black. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 30%, #1a1612 0%, #0b0a08 60%, #050403 100%)",
        }}
      />

      {/* Centre play affordance. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          aria-hidden
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 backdrop-blur-sm"
          style={{ background: "rgba(245,94,9,0.08)" }}
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
      <div className="font-ui absolute left-4 top-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[#f9a71d]"
        />
        {variant === "portrait" ? "Portrait to follow" : label}
      </div>

      {/* Bottom-right timecode-style detail to feel intentional. */}
      <div className="font-ui absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.2em] text-white/45">
        REEL · 01
      </div>
    </div>
  );
}
