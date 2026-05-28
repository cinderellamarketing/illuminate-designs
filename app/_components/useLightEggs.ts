"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Shared homepage easter-egg logic, used on BOTH /session and /room so
// each homepage carries the same hidden fun:
//   - Konami code → warm flourish, then the light maze opens.
//   - Single nav-bulb click → opens the maze (after a short debounce).
//   - Four quick bulb clicks → pops the bulb instead of opening the maze.
//
// The maze itself is rendered by each page as a modal LightMaze; this
// hook only owns the state and the input wiring. Konami listens at the
// window so it works wherever the visitor is on the page.

const KONAMI: ReadonlyArray<string> = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const BULB_POP_THRESHOLD = 4;
const BULB_POP_WINDOW_MS = 900;
const BULB_RESTORE_MS = 1200;
// Wait this long after a click for any follow-up clicks before opening
// the maze. Lets rapid-clickers reach the pop threshold first.
const BULB_OPEN_DELAY_MS = 320;

export type LightEggs = {
  mazeOpen: boolean;
  openMaze: () => void;
  closeMaze: () => void;
  handleBulb: () => void;
  bulbBlown: boolean;
  flourishing: boolean;
};

export function useLightEggs(): LightEggs {
  const [mazeOpen, setMazeOpen] = useState(false);
  const [flourishing, setFlourishing] = useState(false);
  const [bulbBlown, setBulbBlown] = useState(false);
  const clickTimesRef = useRef<number[]>([]);
  const flourishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMazeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMaze = useCallback(() => setMazeOpen(true), []);
  const closeMaze = useCallback(() => setMazeOpen(false), []);

  // Konami code. Window-level listener. Arrows are prevented from
  // scrolling so the typist can actually finish. Auto-repeat ignored.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const buffer: string[] = [];

    const triggerKonami = () => {
      setFlourishing(true);
      if (flourishTimerRef.current) clearTimeout(flourishTimerRef.current);
      flourishTimerRef.current = setTimeout(() => {
        setFlourishing(false);
        setMazeOpen(true);
      }, 720);
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const watching =
        key.startsWith("Arrow") ||
        key === "a" ||
        key === "b" ||
        buffer.length > 0;
      if (!watching) return;

      if (key.startsWith("Arrow")) e.preventDefault();

      buffer.push(key);
      if (buffer.length > KONAMI.length) buffer.shift();
      if (
        buffer.length === KONAMI.length &&
        buffer.every((k, i) => k === KONAMI[i])
      ) {
        buffer.length = 0;
        triggerKonami();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (flourishTimerRef.current) clearTimeout(flourishTimerRef.current);
    };
  }, []);

  // Bulb click handler. Single tap → open maze (after a debounce).
  // Four taps in 900ms → blow the bulb instead.
  const handleBulb = useCallback(() => {
    if (bulbBlown) return;
    const now = performance.now();
    const recent = clickTimesRef.current.filter(
      (t) => now - t < BULB_POP_WINDOW_MS,
    );
    recent.push(now);
    clickTimesRef.current = recent;

    if (recent.length >= BULB_POP_THRESHOLD) {
      if (openMazeTimerRef.current) {
        clearTimeout(openMazeTimerRef.current);
        openMazeTimerRef.current = null;
      }
      clickTimesRef.current = [];
      setBulbBlown(true);
      setTimeout(() => setBulbBlown(false), BULB_RESTORE_MS);
      return;
    }

    if (openMazeTimerRef.current) clearTimeout(openMazeTimerRef.current);
    openMazeTimerRef.current = setTimeout(() => {
      openMazeTimerRef.current = null;
      clickTimesRef.current = [];
      setMazeOpen(true);
    }, BULB_OPEN_DELAY_MS);
  }, [bulbBlown]);

  useEffect(() => {
    return () => {
      if (openMazeTimerRef.current) clearTimeout(openMazeTimerRef.current);
    };
  }, []);

  return { mazeOpen, openMaze, closeMaze, handleBulb, bulbBlown, flourishing };
}
