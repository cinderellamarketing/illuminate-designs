"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsTouch } from "@/lib/useIsTouch";

/* Maze grid: 1 = wall, 0 = open, 2 = target, 3 = start.
   A cinematic S-route through three wide horizontal corridors. The
   player starts bottom-left, runs the lower corridor, climbs the left
   notch, threads the middle corridor, climbs the right notch, then
   finds the workspace top-right. Wide enough to feel designed, not
   fiddly. */
const W = 19;
const H = 11;
const GRID: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const START = { c: 1, r: 9 };
const TARGET = { c: 17, r: 1 };

const SPOTLIGHT_RADIUS_RATIO = 0.44;
const MOVE_MS = 95;

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

function keyToDir(k: string): Dir {
  switch (k) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    default:
      return null;
  }
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
  title = "Find the light.",
  subtitle = "Move the bulb. Switch the workspace on.",
}: LightMazeProps) {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // All gameplay state lives in refs so the rAF loop doesn't trigger
  // re-renders. The dialog's surrounding UI doesn't depend on win state —
  // it reads from refs at draw time only.
  const posRef = useRef({
    r: START.r,
    c: START.c,
    animFrom: null as { r: number; c: number } | null,
    animTo: null as { r: number; c: number } | null,
    animStart: 0,
  });

  // Held-direction tracking for smooth continuous motion. Keys held while
  // an animation completes auto-advance to the next cell, so movement
  // feels like a single fluid slide rather than discrete keypresses.
  const heldRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const lastDirRef = useRef<Dir>(null);

  const wonRef = useRef(false);
  const winStartRef = useRef<number | null>(null);

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
    heldRef.current = { up: false, down: false, left: false, right: false };
    lastDirRef.current = null;
    wonRef.current = false;
    winStartRef.current = null;
  }, [open]);

  /* ---------- input ---------- */

  const tryMove = useCallback((dir: Dir): boolean => {
    if (!dir || wonRef.current) return false;
    const p = posRef.current;
    if (p.animTo) return false; // already animating, ignore
    const { dr, dc } = dirDelta(dir);
    const nr = p.r + dr;
    const nc = p.c + dc;
    if (!isOpen(nr, nc)) return false;
    p.animFrom = { r: p.r, c: p.c };
    p.animTo = { r: nr, c: nc };
    p.animStart = performance.now();
    return true;
  }, []);

  // Pick the next direction to consume after a move finishes. Prefer the
  // most recently pressed key if it's still held; otherwise any held key.
  const pickHeld = useCallback((): Dir => {
    const last = lastDirRef.current;
    const h = heldRef.current;
    if (last && h[last]) return last;
    if (h.right) return "right";
    if (h.left) return "left";
    if (h.down) return "down";
    if (h.up) return "up";
    return null;
  }, []);

  // Keyboard.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const dir = keyToDir(e.key);
      if (!dir) return;
      e.preventDefault();
      // Suppress OS auto-repeat — we drive continuity ourselves from the
      // animation completion handler. Stops jitter and double-moves.
      if (e.repeat) return;
      heldRef.current[dir] = true;
      lastDirRef.current = dir;
      tryMove(dir);
    };
    const onUp = (e: KeyboardEvent) => {
      const dir = keyToDir(e.key);
      if (!dir) return;
      heldRef.current[dir] = false;
    };
    // If the page loses focus, release all keys so the bulb doesn't
    // wander when the user comes back.
    const onBlur = () => {
      heldRef.current = { up: false, down: false, left: false, right: false };
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [open, onClose, tryMove]);

  // Focus management.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
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
      if (Math.max(adx, ady) < 24) return;
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

      // Advance animation, settle on arrival, and chain to the next held
      // direction immediately for unbroken motion.
      const p = posRef.current;
      if (p.animTo && p.animFrom) {
        const t = Math.min(1, (now - p.animStart) / MOVE_MS);
        if (t >= 1) {
          p.r = p.animTo.r;
          p.c = p.animTo.c;
          p.animFrom = null;
          p.animTo = null;

          if (!wonRef.current && p.r === TARGET.r && p.c === TARGET.c) {
            wonRef.current = true;
            winStartRef.current = now;
            const totalWait = reduce ? 700 : 1250;
            setTimeout(() => {
              onWin?.();
              onClose();
            }, totalWait);
          } else {
            const next = pickHeld();
            if (next) tryMove(next);
          }
        }
      }

      // Pixel position. Use a smoother sine-eased blend so the slide
      // between cells feels organic, especially when chained.
      const ppos = (() => {
        if (p.animTo && p.animFrom) {
          const tt = Math.min(1, (now - p.animStart) / MOVE_MS);
          // smoothstep-like easing: gentle accel/decel, no overshoot.
          const e = tt * tt * (3 - 2 * tt);
          const cx = p.animFrom.c + (p.animTo.c - p.animFrom.c) * e + 0.5;
          const cy = p.animFrom.r + (p.animTo.r - p.animFrom.r) * e + 0.5;
          return { x: offX + cx * cell, y: offY + cy * cell };
        }
        return {
          x: offX + (p.c + 0.5) * cell,
          y: offY + (p.r + 0.5) * cell,
        };
      })();

      // 1. Deep black ground.
      ctx.save();
      ctx.fillStyle = "#040302";
      ctx.fillRect(0, 0, cssW, cssH);

      // 2. Maze scene (walls + workspace). Painted fully; the spotlight
      //    overlay in step 3 hides anything outside the bulb's reach.
      drawMaze(ctx, offX, offY, cell, wonRef.current, winStartRef.current, now);
      drawTarget(ctx, offX, offY, cell, wonRef.current, winStartRef.current, now);

      // 3. Spotlight. A wide radial cutout from the bulb, fading to deep
      //    black around the maze. When the puzzle is won the spotlight
      //    blooms outward to reveal the whole room.
      const winT = wonRef.current && winStartRef.current
        ? Math.min(1, (now - winStartRef.current) / (reduce ? 320 : 520))
        : 0;
      const bloom = easeOutCubic(winT);
      const baseRadius = drawW * SPOTLIGHT_RADIUS_RATIO;
      const maxBloom = Math.hypot(drawW, drawH) * 0.65;
      const radius = baseRadius + (maxBloom - baseRadius) * bloom;

      if (winT < 1) {
        const grad = ctx.createRadialGradient(
          ppos.x,
          ppos.y,
          0,
          ppos.x,
          ppos.y,
          radius,
        );
        // Inside the spotlight: subtle warm wash so the maze reads as lit,
        // not just unmasked. Falls off to absolute black at the rim.
        grad.addColorStop(0, "rgba(255,184,80,0.05)");
        grad.addColorStop(0.18, "rgba(7,6,5,0)");
        grad.addColorStop(0.6, "rgba(4,3,2,0.55)");
        grad.addColorStop(0.85, "rgba(4,3,2,0.95)");
        grad.addColorStop(1, "rgba(4,3,2,1)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cssW, cssH);
      }

      // 4. Bulb on top, always glowing.
      drawBulb(ctx, ppos.x, ppos.y, cell, wonRef.current, winT);

      // 5. Win flare: a brief warm-white peak that softens into the
      //    sustained bloom. Reduced motion gets a gentle amber wash.
      if (wonRef.current && winStartRef.current) {
        const flashT = Math.min(1, (now - winStartRef.current) / 280);
        const peak = reduce ? 0.22 : 0.55;
        const alpha = peak * (1 - flashT) * (1 - flashT);
        if (alpha > 0.001) {
          ctx.fillStyle = reduce
            ? `rgba(249,167,29,${alpha.toFixed(3)})`
            : `rgba(255,238,200,${alpha.toFixed(3)})`;
          ctx.fillRect(0, 0, cssW, cssH);
        }

        // Sustained warm room glow after the flash, brightening the
        // whole maze with a soft amber tint. Confident, not strobing.
        const warmT = Math.min(1, (now - winStartRef.current) / 700);
        const warmAlpha = reduce ? 0.08 * warmT : 0.14 * warmT;
        ctx.fillStyle = `rgba(249,167,29,${warmAlpha.toFixed(3)})`;
        ctx.globalCompositeOperation = "screen";
        ctx.fillRect(offX, offY, drawW, drawH);
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.restore();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [open, reduce, onClose, onWin, tryMove, pickHeld]);

  const hint = useMemo(() => {
    if (isTouch) return "Swipe to move. Find the workspace.";
    return "Arrow keys or WASD. Hold to glide.";
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
          ? "linear-gradient(180deg, #020201 0%, #060503 100%)"
          : "rgba(3,2,1,0.97)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="flex w-full max-w-[1080px] flex-col px-6 md:px-10">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-[#f9a71d]/80">
              Illuminate · light maze
            </p>
            <h2
              className="font-display mt-2 italic leading-[1.02] tracking-tight text-[#f4ede0]"
              style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}
            >
              {title}
            </h2>
            <p className="font-serif-text mt-1 text-base italic leading-[1.3] text-[#f4ede0]/65 md:text-lg">
              {subtitle}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-ui ignite shrink-0 rounded-full border border-[#f4ede0]/25 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/85 hover:border-[#f55e09] hover:text-[#f55e09]"
            aria-label="Skip the maze and close"
          >
            {isGate ? "Skip into the room" : "Close"}
            <span aria-hidden className="ml-2">×</span>
          </button>
        </div>

        <div className="relative mt-6">
          <canvas
            ref={canvasRef}
            className="block h-[70svh] max-h-[680px] min-h-[360px] w-full rounded-sm bg-[#040302]"
            style={{ touchAction: "none" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-[#f4ede0]/10"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 font-ui text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
          <span>{hint}</span>
          <span>Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- drawing helpers ---------- */

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function drawMaze(
  ctx: CanvasRenderingContext2D,
  offX: number,
  offY: number,
  cell: number,
  won: boolean,
  winStart: number | null,
  now: number,
) {
  // Floors — warm but dim, only really seen inside the spotlight.
  ctx.fillStyle = "#1c1611";
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (GRID[r][c] === 1) continue;
      ctx.fillRect(offX + c * cell, offY + r * cell, cell, cell);
    }
  }

  // Walls — slightly warmer black so they read as objects when the
  // spotlight passes over them. A thin orange hairline along open
  // edges suggests filament light catching the corner of the wall.
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (GRID[r][c] !== 1) continue;
      const x = offX + c * cell;
      const y = offY + r * cell;
      ctx.fillStyle = "#0c0a08";
      ctx.fillRect(x, y, cell, cell);
      ctx.strokeStyle = "rgba(245,94,9,0.22)";
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

  // Once won, a soft amber wash brightens the floors — the workspace
  // lit the whole room. Climbs in over ~700ms then holds steady.
  if (won && winStart != null) {
    const t = Math.min(1, (now - winStart) / 700);
    ctx.globalAlpha = 0.06 + 0.05 * t;
    ctx.fillStyle = "#f9a71d";
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        if (GRID[r][c] === 1) continue;
        ctx.fillRect(offX + c * cell, offY + r * cell, cell, cell);
      }
    }
    ctx.globalAlpha = 1;
  }
}

function drawTarget(
  ctx: CanvasRenderingContext2D,
  offX: number,
  offY: number,
  cell: number,
  won: boolean,
  winStart: number | null,
  now: number,
) {
  const cx = offX + (TARGET.c + 0.5) * cell;
  const cy = offY + (TARGET.r + 0.5) * cell;
  const s = cell * 0.86;

  // Big halo once the screen comes on — a confident pool of light
  // spilling around the desk.
  if (won && winStart != null) {
    const t = Math.min(1, (now - winStart) / 520);
    const pulse = 0.7 + 0.3 * Math.sin(now / 240);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cell * 4.5);
    grad.addColorStop(0, `rgba(255,206,120,${0.85 * t * pulse})`);
    grad.addColorStop(0.35, `rgba(249,167,29,${0.4 * t})`);
    grad.addColorStop(0.7, "rgba(245,94,9,0.12)");
    grad.addColorStop(1, "rgba(245,94,9,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(cx - cell * 4.5, cy - cell * 4.5, cell * 9, cell * 9);
  }

  // Monitor body.
  const screenW = s;
  const screenH = s * 0.62;
  const screenX = cx - screenW / 2;
  const screenY = cy - screenH / 2 - cell * 0.06;

  ctx.lineWidth = Math.max(1.2, cell * 0.06);
  ctx.strokeStyle = won ? "#fff0c5" : "rgba(244,237,224,0.55)";
  ctx.fillStyle = won ? "#f9a71d" : "rgba(20,16,12,0.85)";

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
  ctx.fillStyle = won ? "rgba(249,167,29,0.7)" : "rgba(244,237,224,0.18)";
  ctx.fill();
  ctx.stroke();

  // Screen lines once lit.
  if (won) {
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
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
  winT: number,
) {
  // Bloom the bulb itself as the workspace switches on — the source
  // grows brighter and bigger to sell the payoff.
  const haloMul = 1.85 + 1.4 * winT;
  const coreMul = 0.24 + 0.18 * winT;
  const core = cell * coreMul;
  const halo = cell * haloMul;

  // Outer warm halo — wide, soft, gradient.
  const outer = ctx.createRadialGradient(x, y, 0, x, y, halo);
  outer.addColorStop(0, "rgba(255,200,110,0.95)");
  outer.addColorStop(0.18, "rgba(255,184,80,0.7)");
  outer.addColorStop(0.4, "rgba(249,167,29,0.42)");
  outer.addColorStop(0.7, "rgba(245,94,9,0.16)");
  outer.addColorStop(1, "rgba(245,94,9,0)");
  ctx.fillStyle = outer;
  ctx.fillRect(x - halo, y - halo, halo * 2, halo * 2);

  // Inner hot ring — the visible bulb glass.
  const inner = ctx.createRadialGradient(x, y, 0, x, y, core * 2.2);
  inner.addColorStop(0, "rgba(255,255,255,1)");
  inner.addColorStop(0.4, "rgba(255,236,180,0.95)");
  inner.addColorStop(1, "rgba(255,200,110,0)");
  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.arc(x, y, core * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // White hot pin.
  ctx.beginPath();
  ctx.arc(x, y, core * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = won ? "#ffffff" : "#fff7e0";
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
