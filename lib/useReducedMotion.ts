"use client";

import { useEffect, useState } from "react";

// Tracks the user's prefers-reduced-motion setting. Re-evaluates on change.
// Defaults to false on the server and on first paint, then settles to the
// real value once we are mounted.
export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduce;
}
