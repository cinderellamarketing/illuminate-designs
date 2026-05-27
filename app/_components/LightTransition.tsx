"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Lights-on page transitions. On route change a near-black overlay wipes
// in and out as the new page mounts. Under reduced motion we fade gently
// for 150ms (no full blackout). Rendered once at the root layout level.
export function LightTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const previousPath = useRef<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "off" | "on">("idle");

  useEffect(() => {
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return;
    }
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    if (reduce) {
      setPhase("on");
      const t = setTimeout(() => setPhase("idle"), 160);
      return () => clearTimeout(t);
    }
    setPhase("off");
    const t1 = setTimeout(() => setPhase("on"), 170);
    const t2 = setTimeout(() => setPhase("idle"), 360);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, reduce]);

  const visible = phase !== "idle";
  const dark = phase === "off";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80]"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 180ms ease-out",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: reduce
            ? "rgba(11,10,8,0.35)"
            : dark
              ? "#070605"
              : "rgba(7,6,5,0)",
          transition: reduce
            ? "background 160ms ease-out"
            : "background 180ms ease-out",
        }}
      />
    </div>
  );
}
