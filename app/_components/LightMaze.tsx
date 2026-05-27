"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsTouch } from "@/lib/useIsTouch";

/* Maze grid: 1 = wall, 0 = open, S = start, T = target.
   Built as an S-shaped path: right, then up via the right column,
   left across a middle corridor, up via the left column, right
   again to the target in the top corridor. Forgiving but not flat. */
const W = 13;
const H = 9;
const GRID: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1], // 2 marks the target
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 3 marks the start
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const START = { c: 1, r: 7 };
const TARGET = { c: 11, r: 1 };

const SPOTLIGHT_RADIUS_RATIO = 0.32;
const MOVE_MS = 120;

type Dir = "up" | "down" | "left" | "right" | null;

function dirDelta(d: Dir): { dr: number; dc: number } {
  switch (d) {
    case "up":
      return { dr: -1, dc: 0 };
    case "down":
      return { dr: 1, dc: 0 };
    case "left":
      return { dr: 0, dc: -1 };
    case "right":
      return { dr: 0, dc: 1 };
    default:
      return { dr: 0, dc: 0 };
  }
}

function isOpen(r: number, c: number): boolean {
  if (r < 0 || r >= H || c < 0 || c >= W) return false;
  return GRID[r][c] !== 1;
}

export type LightMazeProps = {
  open: boolean;
  onClose: () => void;
  onWin?: () => void;
  // "gate" mounts before the page (used as the /room intro); "modal" floats
  // above the page (used from the /session bulb easter egg).
  variant?: "gate" | "modal";
  // Optional intro headline beneath the maze.
  title?: string;
  subtitle?: string;
};

export function LightMaze({
  open,
  onClose,
  onWin,
  variant = "modal",
  title = "Find the workspace.",
  subtitle = "Move the bulb. Light it up.",
}: LightMazeProps) {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // All gameplay state lives in refs so the rAF loop doesn't trigger
  // re-renders. The dialog's surrounding UI doesn't depend on win state —
  // it reads from refs at draw time only.
  const posRef = useRef({ r: START.r, c: START.c, animFrom: null as
    | { r: number; c: number }
    | null, animTo: null as { r: number; c: number } | null, animStart: 0 });
  const queueRef = useRef<Dir>(null);
  const rafRef = useRef<number | null>(null);
  const wonRef = useRef(false);
  const flashStartRef = useRef<number | null>(null);

  // Reset on open. No setState here; the rAF loop reads refs.
  useEffect(() => {
    if (!open) return;
    posRef.current = {
      r: START.r,
      c: START.c,
      animFrom: null,
      animTo: null,
      animStart: 0,
    };
    queueRef.current = null;
    wonRef.current = false;
    flashStartRef.current = null;
  }, [open]);

  /* ---------- input ---------- */

  const tryMove = useCallback((dir: Dir) => {
    if (!dir || wonRef.current) return;
    const p = posRef.current;
    // If currently animating, queue the input; will be tried on arrival.
    if (p.animTo) {
      queueRef.current = dir;
      return;
    }
    const { dr, dc } = dirDelta(dir);
    const nr = p.r + dr;
    const nc = p.c + dc;
    if (!isOpen(nr, nc)) {
      queueRef.current = null;
      return;
    }
    p.animFrom = { r: p.r, c: p.c };
    p.animTo = { r: nr, c: nc };
    p.animStart = performance.now();
    queueRef.current = null;
  }, []);

  // Keyboard.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      let dir: Dir = null;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          dir = "up";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          dir = "down";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          dir = "left";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          dir = "right";
          break;
      }
      if (dir) {
        e.preventDefault();
        tryMove(dir);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, tryMove]);

  // Focus management.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    // Defer to next tick so the overlay has actually painted.
    const t = setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      previous?.focus?.();
    };
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Touch / swipe.
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    let startX = 0;
    let startY = 0;
    let active = false;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      active = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (Math.max(adx, ady) < 24) return; // too small to count
      if (adx > ady) tryMove(dx > 0 ? "right" : "left");
      else tryMove(dy > 0 ? "down" : "up");
    };

    overlay.addEventListener("touchstart", onStart, { passive: true });
    overlay.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      overlay.removeEventListener("touchstart", onStart);
      overlay.removeEventListener("touchend", onEnd);
    };
  }, [open, tryMove]);

  /* ---------- render loop ---------- */

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High-DPI scaling.
    const setupDpr = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setupDpr();

    const onResize = () => setupDpr();
    window.addEventListener("resize", onResize);

    let raf = 0;

    const render = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width;
      const cssH = rect.height;
      const cell = Math.floor(Math.min(cssW / W, cssH / H));
      const drawW = cell * W;
      const drawH = cell * H;
      const offX = Math.floor((cssW - drawW) / 2);
      const offY = Math.floor((cssH - drawH) / 2);

      // Update animation state.
      const p = posRef.current;
      if (p.animTo && p.animFrom) {
        const t = Math.min(1, (now - p.animStart) / MOVE_MS);
        if (t >= 1) {
          p.r = p.animTo.r;
          p.c = p.animTo.c;
          p.animFrom = null;
          p.animTo = null;

          // Win check.
          if (
            !wonRef.current &&
            p.r === TARGET.r &&
            p.c === TARGET.c
          ) {
            wonRef.current = true;
            flashStartRef.current = now;
            const totalWait = reduce ? 500 : 600;
            setTimeout(() => {
              onWin?.();
              onClose();
            }, totalWait);
          } else if (queueRef.current) {
            // Consume queued input.
            const next = queueRef.current;
            queueRef.current = null;
            tryMove(next);
          }
        }
      }

      // Compute pixel position (cell centre).
      const ppos = (() => {
        if (p.animTo && p.animFrom) {
          const t = Math.min(1, (now - p.animStart) / MOVE_MS);
          // ease-out cubic
          const e = 1 - Math.pow(1 - t, 3);
          const cx =
            p.animFrom.c + (p.animTo.c - p.animFrom.c) * e + 0.5;
          const cy =
            p.animFrom.r + (p.animTo.r - p.animFrom.r) * e + 0.5;
          return { x: offX + cx * cell, y: offY + cy * cell };
        }
        return {
          x: offX + (p.c + 0.5) * cell,
          y: offY + (p.r + 0.5) * cell,
        };
      })();

      // 1. Fill background — full darkness.
      ctx.save();
      ctx.fillStyle = "#070605";
      ctx.fillRect(0, 0, cssW, cssH);

      // 2. Draw maze scene fully (walls + target). The spotlight overlay
      //    in step 3 hides anything outside the bulb's reach.
      drawMaze(ctx, offX, offY, cell, wonRef.current, now);
      drawTarget(ctx, offX, offY, cell, wonRef.current, now);

      // 3. Spotlight: a radial gradient from clear at the bulb's centre
      //    to opaque darkness around it. Skip the gradient under reduced
      //    motion only when the maze is already won (so the user can see
      //    their finish state). The reveal itself is still spotlight-led.
      if (!wonRef.current) {
        const radius = drawW * SPOTLIGHT_RADIUS_RATIO;
        const grad = ctx.createRadialGradient(
          ppos.x,
          ppos.y,
          0,
          ppos.x,
          ppos.y,
          radius,
        );
        grad.addColorStop(0, "rgba(7,6,5,0)");
        grad.addColorStop(0.5, "rgba(7,6,5,0.55)");
        grad.addColorStop(0.85, "rgba(7,6,5,0.95)");
        grad.addColorStop(1, "rgba(7,6,5,1)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cssW, cssH);
      } else {
        // Once won: the workspace switching on lights the whole maze.
        // Use a soft luminance lift, not a hard flash.
        const fadeMs = reduce ? 400 : 360;
        const t = flashStartRef.current
          ? Math.min(1, (now - flashStartRef.current) / fadeMs)
          : 1;
        const alpha = 1 - t;
        if (alpha > 0) {
          const radius = drawW * (SPOTLIGHT_RADIUS_RATIO + 0.5 * t);
          const grad = ctx.createRadialGradient(
            ppos.x,
            ppos.y,
            0,
            ppos.x,
            ppos.y,
            radius,
          );
          grad.addColorStop(0, "rgba(7,6,5,0)");
          grad.addColorStop(1, `rgba(7,6,5,${0.95 * alpha})`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, cssW, cssH);
        }
      }

      // 4. Draw the bulb on top of everything so it always glows.
      drawBulb(ctx, ppos.x, ppos.y, cell, wonRef.current);

      // 5. Win flourish: a brief white softness, not a strobe.
      if (wonRef.current && flashStartRef.current) {
        const t = Math.min(1, (now - flashStartRef.current) / 220);
        // Reduced motion: a gentle warm tint, no white peak.
        const alpha = reduce ? 0.18 * (1 - t) : 0.42 * (1 - t);
        ctx.fillStyle = reduce
          ? `rgba(249,167,29,${alpha.toFixed(3)})`
          : `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fillRect(0, 0, cssW, cssH);
      }

      ctx.restore();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    rafRef.current = raf;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [open, reduce, onClose, onWin, tryMove]);

  const hint = useMemo(() => {
    if (isTouch) return "Swipe to move. Find the dark workspace.";
    return "Arrow keys or WASD. Find the dark workspace.";
  }, [isTouch]);

  if (!open) return null;

  const isGate = variant === "gate";

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Light maze. Move the bulb to find the workspace."
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center"
      style={{
        background: isGate
          ? "linear-gradient(180deg, #050403 0%, #0a0907 100%)"
          : "rgba(5,4,3,0.94)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div className="flex w-full max-w-[820px] flex-col px-6 md:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-[#f9a71d]/85">
              Illuminate · light maze
            </p>
            <h2 className="font-display mt-2 text-2xl italic leading-[1.1] text-[#f4ede0] md:text-3xl">
              {title}
            </h2>
            <p className="font-serif-text mt-1 text-base italic text-[#f4ede0]/70 md:text-lg">
              {subtitle}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-ui ignite shrink-0 rounded-full border border-[#f4ede0]/30 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/85 hover:border-[#f55e09] hover:text-[#f55e09]"
            aria-label="Skip the maze and close"
          >
            {isGate ? "Skip into the room" : "Close"}
            <span aria-hidden className="ml-2">×</span>
          </button>
        </div>

        <div className="relative mt-6">
          <canvas
            ref={canvasRef}
            className="block h-[64svh] max-h-[560px] min-h-[320px] w-full rounded-sm bg-[#070605]"
            // Touch-action so swipes don't scroll the page.
            style={{ touchAction: "none" }}
          />
          {/* Subtle frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-[#f4ede0]/10"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
          <span>{hint}</span>
          <span>Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- drawing helpers ---------- */

function drawMaze(
  ctx: CanvasRenderingContext2D,
  offX: number,
  offY: number,
  cell: number,
  won: boolean,
  now: number,
) {
  // Floors — almost invisible until the spotlight reaches them; we still
  // paint them so the spotlight has something warm to reveal.
  ctx.fillStyle = "#1a1612";
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (GRID[r][c] === 1) continue;
      ctx.fillRect(offX + c * cell, offY + r * cell, cell, cell);
    }
  }

  // Walls — a touch warmer than the void, with a thin orange hairline edge
  // so they read as objects in the spotlight rather than absence.
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (GRID[r][c] !== 1) continue;
      const x = offX + c * cell;
      const y = offY + r * cell;
      ctx.fillStyle = "#0d0b09";
      ctx.fillRect(x, y, cell, cell);
      // Hairline along open neighbours.
      ctx.strokeStyle = "rgba(245,94,9,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (r + 1 < H && GRID[r + 1][c] !== 1) {
        ctx.moveTo(x, y + cell);
        ctx.lineTo(x + cell, y + cell);
      }
      if (r - 1 >= 0 && GRID[r - 1][c] !== 1) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cell, y);
      }
      if (c + 1 < W && GRID[r][c + 1] !== 1) {
        ctx.moveTo(x + cell, y);
        ctx.lineTo(x + cell, y + cell);
      }
      if (c - 1 >= 0 && GRID[r][c - 1] !== 1) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cell);
      }
      ctx.stroke();
    }
  }

  // Once won, brighten everything slightly — the workspace lit the room.
  if (won) {
    const t = Math.min(1, ((now % 1200) + 0) / 1200);
    ctx.globalAlpha = 0.04 + 0.02 * Math.sin(t * Math.PI * 2);
    ctx.fillStyle = "#f9a71d";
    ctx.fillRect(offX, offY, cell * W, cell * H);
    ctx.globalAlpha = 1;
  }
}

function drawTarget(
  ctx: CanvasRenderingContext2D,
  offX: number,
  offY: number,
  cell: number,
  won: boolean,
  now: number,
) {
  // Abstract workspace: a small monitor on a desk. Dim until won, then
  // its screen lights up and a soft halo pours into the room around it.
  const cx = offX + (TARGET.c + 0.5) * cell;
  const cy = offY + (TARGET.r + 0.5) * cell;
  const s = cell * 0.78;

  // Halo when on.
  if (won) {
    const pulse = 0.6 + 0.4 * Math.sin(now / 220);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cell * 3.2);
    grad.addColorStop(0, `rgba(249,167,29,${0.55 * pulse})`);
    grad.addColorStop(0.5, "rgba(245,94,9,0.18)");
    grad.addColorStop(1, "rgba(245,94,9,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(cx - cell * 3.2, cy - cell * 3.2, cell * 6.4, cell * 6.4);
  }

  // Monitor outline.
  const screenW = s;
  const screenH = s * 0.62;
  const screenX = cx - screenW / 2;
  const screenY = cy - screenH / 2 - cell * 0.06;

  ctx.lineWidth = Math.max(1.2, cell * 0.06);
  ctx.strokeStyle = won ? "#f9a71d" : "rgba(244,237,224,0.55)";
  ctx.fillStyle = won ? "rgba(249,167,29,0.85)" : "rgba(20,16,12,0.85)";

  // Rounded screen rect.
  const r = Math.max(2, cell * 0.08);
  roundedRect(ctx, screenX, screenY, screenW, screenH, r);
  ctx.fill();
  ctx.stroke();

  // Stand.
  ctx.beginPath();
  const standW = screenW * 0.32;
  ctx.moveTo(cx - standW / 2, screenY + screenH);
  ctx.lineTo(cx + standW / 2, screenY + screenH);
  ctx.lineTo(cx + standW * 0.7, screenY + screenH + cell * 0.22);
  ctx.lineTo(cx - standW * 0.7, screenY + screenH + cell * 0.22);
  ctx.closePath();
  ctx.fillStyle = won ? "rgba(249,167,29,0.6)" : "rgba(244,237,224,0.18)";
  ctx.fill();
  ctx.stroke();

  // Tiny screen lines for texture.
  if (won) {
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const y = screenY + screenH * (0.28 + i * 0.18);
      ctx.beginPath();
      ctx.moveTo(screenX + screenW * 0.15, y);
      ctx.lineTo(screenX + screenW * (0.55 + 0.1 * i), y);
      ctx.stroke();
    }
  }
}

function drawBulb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cell: number,
  won: boolean,
) {
  const core = cell * 0.18;
  const halo = cell * 1.05;

  // Warm halo.
  const grad = ctx.createRadialGradient(x, y, 0, x, y, halo);
  grad.addColorStop(0, "rgba(255,184,80,0.85)");
  grad.addColorStop(0.25, "rgba(249,167,29,0.55)");
  grad.addColorStop(0.6, "rgba(245,94,9,0.18)");
  grad.addColorStop(1, "rgba(245,94,9,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(x - halo, y - halo, halo * 2, halo * 2);

  // Hot core.
  ctx.beginPath();
  ctx.arc(x, y, core, 0, Math.PI * 2);
  ctx.fillStyle = won ? "#fff7d8" : "#fff1c5";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, core * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
