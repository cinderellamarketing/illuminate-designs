"use client";

import { forwardRef, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type BulbMarkProps = {
  size?: number;
  className?: string;
  // Tone hint: light variant for dark backgrounds, ink for cream backgrounds.
  tone?: "light" | "ink";
  // The element is a button when onClick is provided, otherwise a span.
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
};

// Small outlined bulb glyph. Idle flicker fires roughly every 8–12 seconds
// (skipped under reduced motion). Hovering ignites a warm glow. Used as the
// nav mark on /session — clicking it opens the LightMaze easter egg.
export const BulbMark = forwardRef<HTMLButtonElement, BulbMarkProps>(
  function BulbMark(
    {
      size = 22,
      className = "",
      tone = "light",
      onClick,
      ariaLabel,
      title,
    },
    ref,
  ) {
    const reduce = useReducedMotion();
    const [flicker, setFlicker] = useState(false);

    useEffect(() => {
      if (reduce) return;
      let cancelled = false;
      let timeout: ReturnType<typeof setTimeout> | null = null;

      const schedule = () => {
        const wait = 8000 + Math.random() * 4000;
        timeout = setTimeout(() => {
          if (cancelled) return;
          setFlicker(true);
          timeout = setTimeout(() => {
            if (cancelled) return;
            setFlicker(false);
            schedule();
          }, 110);
        }, wait);
      };
      schedule();
      return () => {
        cancelled = true;
        if (timeout) clearTimeout(timeout);
      };
    }, [reduce]);

    const stroke = tone === "ink" ? "#0b0a08" : "#f4ede0";

    const glyph = (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className={`bulb-mark__glyph ${flicker ? "is-flicker" : ""}`}
        style={{ color: stroke }}
      >
        {/* glass envelope */}
        <path
          d="M12 3.25c-3.45 0-6.25 2.7-6.25 6.05 0 2.06 1.04 3.86 2.62 4.96.55.38.88 1 .88 1.66v1.2c0 .76.62 1.38 1.38 1.38h2.74c.76 0 1.38-.62 1.38-1.38v-1.2c0-.66.33-1.28.88-1.66 1.58-1.1 2.62-2.9 2.62-4.96 0-3.35-2.8-6.05-6.25-6.05z"
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinejoin="round"
          fill="none"
        />
        {/* warm filament core — high-saturation amber so the bulb reads as
            interactive against both dark video and cream paper backgrounds
            even through mix-blend-difference */}
        <circle cx="12" cy="10.4" r="1.5" fill="#f9a71d" />
        <path
          d="M10.5 11.5 12 9.8l1.5 1.7"
          stroke="#f55e09"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* base contacts */}
        <path
          d="M9.5 19.6h5M10.5 21h3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );

    if (onClick) {
      return (
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          aria-label={ariaLabel ?? "Illuminate bulb"}
          title={title}
          className={`bulb-mark bulb-mark--button ${className}`}
        >
          {glyph}
        </button>
      );
    }
    return (
      <span
        aria-hidden
        title={title}
        className={`bulb-mark ${className}`}
      >
        {glyph}
      </span>
    );
  },
);
