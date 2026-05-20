"use client";

import { useRef, useState } from "react";

// Cursor-tracked wordmark reveal. Two stacked "Illuminate" layers:
// a near-invisible base, and a brand-orange copy clipped by a radial
// mask that follows the pointer. The reveal only paints while the
// pointer is over the band — no idle drift, no lingering glow.
export function StudioSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty(
      "--mx",
      `${((e.clientX - r.left) / r.width) * 100}%`,
    );
    el.style.setProperty(
      "--my",
      `${((e.clientY - r.top) / r.height) * 100}%`,
    );
    if (!active) setActive(true);
  };

  const handleLeave = () => setActive(false);

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
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative w-full select-none overflow-hidden"
      style={{ "--mx": "-9999px", "--my": "-9999px" } as React.CSSProperties}
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
          opacity: active ? 1 : 0,
          WebkitMaskImage:
            "radial-gradient(circle 260px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.85) 55%, transparent 100%)",
          maskImage:
            "radial-gradient(circle 260px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.85) 55%, transparent 100%)",
        }}
      >
        Illuminate
      </div>
      {active && (
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
