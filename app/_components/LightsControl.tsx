"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Site-wide lights toggle. Pressing L or clicking the corner switch
// drops the whole site into darkness, lit only by a cursor-following
// torch that uses the same warm radial language as the footer
// wordmark spotlight. The StudioSpotlight component is left alone;
// this is a separate overlay with its own behaviour.
//
// Reduced-motion users get an instant toggle, no animation. Inputs
// and textareas suppress the L hotkey so typing is unaffected.
export function LightsControl() {
  const reduce = useReducedMotion();
  const [off, setOff] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const toggle = useCallback(() => setOff((v) => !v), []);

  // Keyboard: L toggles the lights. Ignore while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key !== "l" && e.key !== "L") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  // Cursor tracking. Updates CSS variables on the overlay element so
  // the radial mask follows the pointer without React re-renders.
  // Touch users get the same effect anchored to the last touch point.
  useEffect(() => {
    if (!off) return;
    const el = overlayRef.current;
    if (!el) return;
    // Start centred so the torch is visible immediately before any move.
    el.style.setProperty("--lx", "50%");
    el.style.setProperty("--ly", "50%");
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--lx", `${e.clientX}px`);
      el.style.setProperty("--ly", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [off]);

  // Sync body class so other components can react if needed.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("lights-off", off);
    return () => {
      document.body.classList.remove("lights-off");
    };
  }, [off]);

  // Console nudge the first time the lights go off. Subtle, brief.
  const announcedRef = useRef(false);
  useEffect(() => {
    if (!off || announcedRef.current) return;
    announcedRef.current = true;
    try {
      const muted =
        "color:#f9a71d; font:13px/1.4 'Hanken Grotesk', sans-serif";
      console.log(
        "%cLights off. Move the cursor. Press L again to bring them back.",
        muted,
      );
    } catch {}
  }, [off]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        className="lights-overlay"
        data-active={off ? "true" : "false"}
        data-reduce={reduce ? "true" : "false"}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={off}
        aria-label={off ? "Turn the lights on" : "Turn the lights off"}
        title={
          off
            ? "Put the kettle on, turn the lights back on (L)"
            : "Try it in the dark. Press L."
        }
        className="lights-switch ignite"
      >
        <span aria-hidden className="lights-switch__pip" />
        <span aria-hidden className="lights-switch__label">
          {off ? "Lights" : "Lights"}
        </span>
        <span aria-hidden className="lights-switch__state">
          {off ? "off" : "on"}
        </span>
      </button>
    </>
  );
}
