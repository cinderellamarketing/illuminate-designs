"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Lights-on page transitions. On route change a near-black overlay wipes
// in and out as the new page mounts. Under reduced motion we fade gently
// for 150ms (no full blackout). Rendered once at the root layout level.
//
// Implemented with direct ref mutation so the transition doesn't trigger
// React re-renders on every pathname change.
export function LightTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const previousPath = useRef<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return;
    }
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    const overlay = overlayRef.current;
    const inner = innerRef.current;
    if (!overlay || !inner) return;

    if (reduce) {
      overlay.style.opacity = "1";
      inner.style.background = "rgba(11,10,8,0.35)";
      const t = setTimeout(() => {
        overlay.style.opacity = "0";
      }, 160);
      return () => clearTimeout(t);
    }

    overlay.style.opacity = "1";
    inner.style.background = "#070605";
    const t1 = setTimeout(() => {
      inner.style.background = "rgba(7,6,5,0)";
    }, 170);
    const t2 = setTimeout(() => {
      overlay.style.opacity = "0";
    }, 360);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, reduce]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80]"
      style={{ opacity: 0, transition: "opacity 180ms ease-out" }}
    >
      <div
        ref={innerRef}
        className="absolute inset-0"
        style={{
          background: "rgba(7,6,5,0)",
          transition: "background 180ms ease-out",
        }}
      />
    </div>
  );
}
