"use client";

import { useEffect, useRef } from "react";
import { useIsTouch } from "@/lib/useIsTouch";

// Cursor-tracked wordmark reveal. Two stacked "Illuminate" layers:
// a near-invisible base, and a brand-orange copy clipped by a radial
// mask that follows the pointer. Falls back to a slow drift on touch
// devices and whenever the cursor is not over the band.
export function StudioSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    let hovering = false;

    const tick = () => {
      if (!hovering) {
        t += 0.005;
        const x = 50 + Math.sin(t) * 28;
        const y = 50 + Math.cos(t * 0.6) * 22;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    if (isTouch) {
      return () => cancelAnimationFrame(raf);
    }

    const onMove = (e: MouseEvent) => {
      hovering = true;
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--mx",
        `${((e.clientX - r.left) / r.width) * 100}%`,
      );
      el.style.setProperty(
        "--my",
        `${((e.clientY - r.top) / r.height) * 100}%`,
      );
    };
    const onLeave = () => {
      hovering = false;
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [isTouch]);

  const wordmarkClass =
    "font-display block leading-[0.85] tracking-[-0.04em]";
  const wordmarkStyle: React.CSSProperties = {
    fontSize: "clamp(5rem, 18vw, 18rem)",
    fontVariationSettings: '"opsz" 144',
    fontWeight: 700,
  };

  return (
    <div
      ref={ref}
      className="relative w-full select-none overflow-hidden"
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      <div
        aria-hidden
        className={`${wordmarkClass} text-white/[0.07]`}
        style={wordmarkStyle}
      >
        Illuminate
      </div>
      <div
        aria-hidden
        className={`${wordmarkClass} absolute inset-0`}
        style={{
          ...wordmarkStyle,
          color: "#f55e09",
          WebkitMaskImage:
            "radial-gradient(circle 260px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.85) 55%, transparent 100%)",
          maskImage:
            "radial-gradient(circle 260px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.85) 55%, transparent 100%)",
        }}
      >
        Illuminate
      </div>
      {!isTouch && (
        <span
          aria-hidden
          className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: "var(--mx)",
            top: "var(--my)",
            background:
              "radial-gradient(circle, rgba(245,94,9,0.30) 0%, rgba(245,94,9,0) 70%)",
            mixBlendMode: "screen",
          }}
        />
      )}
      <span className="sr-only">Illuminate</span>
    </div>
  );
}
