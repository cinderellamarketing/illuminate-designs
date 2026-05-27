"use client";

import { useEffect, useState } from "react";

// Tracks which homepage the visitor entered through, so the logo and
// Home link return them to the same one. Set on /session and /room.
// Defaults to /session if the visitor lands on an inner page directly.

export type Variant = "session" | "room";
export const VARIANT_KEY = "illuminate_variant";
const VARIANT_EVENT = "illuminate-variant-change";

function readStored(): Variant {
  if (typeof window === "undefined") return "session";
  try {
    const v = window.sessionStorage.getItem(VARIANT_KEY);
    if (v === "session" || v === "room") return v;
  } catch {}
  return "session";
}

function writeStored(v: Variant) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(VARIANT_KEY, v);
  } catch {}
  // Notify any listeners in the same tab. Storage events only fire
  // cross-tab, so we emit a custom event for in-tab consumers.
  window.dispatchEvent(
    new CustomEvent(VARIANT_EVENT, { detail: { variant: v } }),
  );
}

// Stamp the current variant. Call from /session or /room on mount.
export function useDeclareVariant(variant: Variant) {
  useEffect(() => {
    writeStored(variant);
  }, [variant]);
}

// Read the current variant. Returns "session" by default until the
// client effect resolves it, so SSR and first paint are stable.
export function useVariant(): Variant {
  const [variant, setVariant] = useState<Variant>("session");
  useEffect(() => {
    setVariant(readStored());
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<{ variant: Variant }>).detail;
      if (detail?.variant === "session" || detail?.variant === "room") {
        setVariant(detail.variant);
      }
    };
    window.addEventListener(VARIANT_EVENT, onCustom);
    return () => window.removeEventListener(VARIANT_EVENT, onCustom);
  }, []);
  return variant;
}

export function setVariant(v: Variant) {
  writeStored(v);
}
