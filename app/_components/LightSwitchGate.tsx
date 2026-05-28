"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Shared first-visit intro, used on BOTH /session and /room. The screen
// starts dark (near-black), lit only by a cursor torch that reuses the
// same warm radial language as the site-wide lights overlay, so the
// spotlight is already at work. A light switch sits centre stage; flick
// it and the room blooms on, revealing the homepage underneath.
//
// The real homepage is always rendered beneath this layer — the gate is
// just a dismissible overlay, so content and SSR are never blocked.
//
// Shown once per browser via a single site-wide flag, regardless of
// which homepage the visitor enters through. Keyboard focusable, with an
// any-key / any-click fallback so nobody gets stuck. Reduced motion gets
// a gentle fade with no flashing.

// Site-wide, shared between both homepages. Swap the line below freely.
const LIGHTS_KEY = "illuminate_lights_on";
const GATE_LINE = "Let us illuminate the tools you already pay for";

// Keys that should not count as a "flick" on their own.
const IGNORED_KEYS = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "Tab",
  "CapsLock",
]);

type Phase = "hidden" | "dark" | "blooming";

export function LightSwitchGate() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("hidden");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const switchRef = useRef<HTMLButtonElement | null>(null);
  const dismissedRef = useRef(false);

  // First-visit decision. Defaults to hidden (returning visitor) so the
  // lit site is never blocked; only a confirmed first visit raises it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let lit = false;
    try {
      lit = window.localStorage.getItem(LIGHTS_KEY) === "1";
    } catch {
      // Storage blocked — treat as a returning visitor so we never trap
      // anyone behind a gate we can't remember dismissing.
      lit = true;
    }
    // One-shot read of an external store (localStorage) on mount, which an
    // effect is the right place for; we deliberately start hidden so SSR
    // and hydration stay stable and the lit site is never blocked.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!lit) setPhase("dark");
  }, []);

  // Send focus to the switch as the gate appears.
  useEffect(() => {
    if (phase !== "dark") return;
    const t = setTimeout(() => switchRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [phase]);

  // Lock scroll while the gate is up.
  useEffect(() => {
    if (phase === "hidden") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  // Cursor torch. Writes CSS variables on the root so the warm radial
  // follows the pointer without React re-renders. Starts centred so the
  // torch is visible before the first move; touch anchors to last touch.
  useEffect(() => {
    if (phase !== "dark") return;
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--lx", "50%");
    el.style.setProperty("--ly", "42%");
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
  }, [phase]);

  const flick = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    try {
      window.localStorage.setItem(LIGHTS_KEY, "1");
    } catch {}
    setPhase("blooming");
    // Hold long enough for the bloom to read, then unmount. Reduced
    // motion skips the flash and just fades, so it can leave sooner.
    const wait = reduce ? 240 : 720;
    window.setTimeout(() => setPhase("hidden"), wait);
  }, [reduce]);

  // Any key turns the lights on as a fallback so nobody gets stuck.
  // Enter/Space on the focused switch is the intended path; everything
  // else (bar lone modifiers) is forgiving insurance.
  useEffect(() => {
    if (phase !== "dark") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (IGNORED_KEYS.has(e.key)) return;
      e.preventDefault();
      flick();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, flick]);

  if (phase === "hidden") return null;

  const lit = phase === "blooming";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Turn the lights on to enter the site"
      className="lightswitch-gate"
      data-phase={phase}
      data-reduce={reduce ? "true" : "false"}
      onClick={flick}
    >
      <div aria-hidden className="lightswitch-gate__dark" />
      <div aria-hidden className="lightswitch-gate__torch" />
      <div aria-hidden className="lightswitch-gate__bloom" />

      <div className="lightswitch-gate__panel">
        <p className="lightswitch-gate__line font-display">{GATE_LINE}</p>

        <button
          ref={switchRef}
          type="button"
          role="switch"
          aria-checked={lit}
          aria-label="Turn the lights on"
          className="lightswitch-toggle ignite"
          onClick={(e) => {
            e.stopPropagation();
            flick();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
              e.preventDefault();
              flick();
            }
          }}
        >
          <span aria-hidden className="lightswitch-toggle__plate">
            <span className="lightswitch-toggle__led" />
            <span className="lightswitch-toggle__paddle" />
          </span>
        </button>

        <p aria-hidden className="lightswitch-gate__hint font-ui">
          Flick the switch
        </p>
      </div>
    </div>
  );
}
