"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// The 82% stat, rendered as a mono readout framed like a gauge: a big
// tabular figure, a meter that fills from the industry baseline (30) up
// to the headline number, and a tick marking where most rollouts stall.
// Keeps the old 30 -> 82 count-up, restyled in mono.
//
// Reduced motion goes straight to the final value with no sweep. The
// animation starts when the meter first scrolls into view.
type StatMeterProps = {
  value?: number;
  from?: number;
  unit?: string;
  label?: string;
  caption?: string;
  industryLabel?: string;
  // Number size as a CSS length/clamp; the meter and labels scale with it.
  fontSize?: string;
  meterMaxWidth?: string;
  align?: "left" | "center";
  tooltip?: string;
  className?: string;
};

export function StatMeter({
  value = 82,
  from = 30,
  unit = "%",
  label,
  caption,
  industryLabel,
  fontSize = "clamp(4.5rem, 12vw, 9rem)",
  meterMaxWidth = "420px",
  align = "left",
  tooltip,
  className = "",
}: StatMeterProps) {
  const centered = align === "center";
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(from);

  // Fire once when scrolled into view (fires immediately for above-the-fold
  // placements since they intersect on mount).
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (reduce) {
      setCount(value);
      return;
    }
    const duration = 1500;
    let raf = 0;
    let startTs: number | null = null;
    const tick = (now: number) => {
      if (startTs === null) startTs = now;
      const t = Math.min(1, (now - startTs) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(from + (value - from) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reduce, value, from]);

  const display = reduce ? value : count;
  const fillPct = started || reduce ? value : from;
  const industry = industryLabel ?? `industry ${from}${unit}`;

  return (
    <div
      ref={ref}
      className={`${centered ? "text-center" : ""} ${className}`}
      title={tooltip}
    >
      {label && (
        <p className="label mb-3 uppercase tracking-[0.14em]">{label}</p>
      )}

      <div
        className="font-mono font-semibold leading-[0.82] tabular-nums text-brand-orange"
        style={{ fontSize }}
        aria-label={`${value} per cent`}
      >
        {display}
        {unit}
      </div>

      {/* Gauge. Track holds the fill; the baseline tick marks 30. */}
      <div
        className={`relative mt-6 w-full ${centered ? "mx-auto" : ""}`}
        style={{ maxWidth: meterMaxWidth }}
        aria-hidden
      >
        <div className="h-[10px] w-full overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full rounded-full"
            style={{
              width: `${fillPct}%`,
              background:
                "linear-gradient(90deg, #f55e09 0%, #f9a71d 100%)",
              boxShadow: "0 0 16px -2px rgba(249,167,29,0.7)",
              transition: reduce
                ? "none"
                : "width 1500ms cubic-bezier(0.2,0.7,0.2,1)",
            }}
          />
        </div>

        {/* Industry baseline marker. */}
        <div
          className="absolute top-0 h-[10px] w-px bg-text/45"
          style={{ left: `${from}%` }}
        />
        <div
          className="absolute top-[16px] -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.04em] text-text-muted"
          style={{ left: `${from}%` }}
        >
          {industry}
        </div>
      </div>

      {caption && (
        <p
          className={`mt-9 max-w-[34ch] font-mono text-[13px] leading-[1.5] text-text-muted ${
            centered ? "mx-auto" : ""
          }`}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
