"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsTouch } from "@/lib/useIsTouch";

/* The maze is generated fresh each time it opens with a recursive
   backtracker (depth-first carving). That gives real branching paths and
   dead ends, and a different layout on every visit for replayability.

   Cells are carved on a coarse grid; the rendered grid is (2*cols+1) by
   (2*rows+1) so every passage has a one-cell wall around it. 1 = wall,
   0 = open. The bulb starts bottom-left; the workspace sits top-right. */

const MAZE_COLS = 9;
const MAZE_ROWS = 7;

// generateMaze always carves the start at the bottom-left passage, so the
// bulb's opening cell is known without reading the maze during render.
const START_R = (MAZE_ROWS - 1) * 2 + 1;
const START_C = 1;

// Spotlight reach measured in cells, not pixels, so the challenge stays
// the same whatever the viewport: a small pool of light around the bulb.
// Touch gets a touch more reach since cells are tiny on a phone.
const LIGHT_CELLS_POINTER = 3.3;
const LIGHT_CELLS_TOUCH = 3.9;

const MOVE_MS = 95;

type Maze = {
  grid: Uint8Array;
  W: number;
  H: number;
  start: { r: number; c: number };
  target: { r: number; c: number };
};

function generateMaze(cols: number, rows: number): Maze {
  const W = cols * 2 + 1;
  const H = rows * 2 + 1;
  const grid = new Uint8Array(W * H).fill(1); // everything walled to start
  const at = (r: number, c: number) => r * W + c;

  const visited = new Array(cols * rows).fill(false);
  const cell = (cr: number, cc: number) => cr * cols + cc;

  const dirs = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  // Explicit stack rather than recursion so a big maze can't blow the
  // call stack.
  const stack: Array<{ cr: number; cc: number }> = [];
  const startCr = rows - 1;
  const startCc = 0;
  visited[cell(startCr, startCc)] = true;
  grid[at(startCr * 2 + 1, startCc * 2 + 1)] = 0;
  stack.push({ cr: startCr, cc: startCc });

  while (stack.length) {
    const cur = stack[stack.length - 1];
    const open: Array<{ nr: number; nc: number; dr: number; dc: number }> = [];
    for (const d of dirs) {
      const nr = cur.cr + d.dr;
      const nc = cur.cc + d.dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (visited[cell(nr, nc)]) continue;
      open.push({ nr, nc, dr: d.dr, dc: d.dc });
    }
    if (open.length === 0) {
      stack.pop();
      continue;
    }
    const pick = open[(Math.random() * open.length) | 0];
    // Knock through the wall between the two cells, then open the cell.
    grid[at(cur.cr * 2 + 1 + pick.dr, cur.cc * 2 + 1 + pick.dc)] = 0;
    grid[at(pick.nr * 2 + 1, pick.nc * 2 + 1)] = 0;
    visited[cell(pick.nr, pick.nc)] = true;
    stack.push({ cr: pick.nr, cc: pick.nc });
  }

  return {
    grid,
    W,
    H,
    start: { r: (rows - 1) * 2 + 1, c: 1 },
    target: { r: 1, c: (cols - 1) * 2 + 1 },
  };
}

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

function isOpen(maze: Maze, r: number, c: number): boolean {
  if (r < 0 || r >= maze.H || c < 0 || c >= maze.W) return false;
  return maze.grid[r * maze.W + c] !== 1;
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

// Dry little sign-off, scaled to how long it took. British, no fuss.
function winLine(seconds: number): string {
  if (seconds <= 20) return `Lights on in ${seconds} seconds. Show off.`;
  if (seconds <= 45) return `Lights on in ${seconds} seconds. Tidy.`;
  if (seconds <= 90) return `Lights on in ${seconds} seconds. Got there.`;
  return `Lights on in ${seconds} seconds. We will say no more about it.`;
}

export type LightMazeProps = {
  open: boolean;
  onClose: () => void;
  onWin?: () => void;
  // "gate" mounts before the page; "modal" floats above it (the bulb /
  // Konami easter egg on both homepages uses "modal").
  variant?: "gate" | "modal";
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

  // The generated maze for this opening. Lives in a ref so the rAF loop
  // reads it without re-rendering.
  const mazeRef = useRef<Maze>(generateMaze(MAZE_COLS, MAZE_ROWS));

  // All gameplay state lives in refs so the rAF loop doesn't trigger
  // re-renders. The only thing that re-renders the dialog is the final
  // win time, surfaced once for the dry sign-off line.
  const posRef = useRef({
    r: START_R,
    c: START_C,
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
  // Clock starts on the first move so reading the intro isn't punished.
  const moveStartRef = useRef<number | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [winSeconds, setWinSeconds] = useState<number | null>(null);

  // Clear the win line when the maze (re)opens. Done during render with the
  // previous-value-in-state pattern (not an effect, not a ref) so it neither
  // trips the hooks rules nor leaves a stale line on the next opening.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setWinSeconds(null);
  }

  // Reset on open: a fresh maze, bulb back at the start, clocks cleared.
  useEffect(() => {
    if (!open) return;
    const maze = generateMaze(MAZE_COLS, MAZE_ROWS);
    mazeRef.current = maze;
    posRef.current = {
      r: maze.start.r,
      c: maze.start.c,
      animFrom: null,
      animTo: null,
      animStart: 0,
    };
    heldRef.current = { up: false, down: false, left: false, right: false };
    lastDirRef.current = null;
    wonRef.current = false;
    winStartRef.current = null;
    moveStartRef.current = null;
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open]);

  /* ---------- input ---------- */

  const tryMove = useCallback((dir: Dir): boolean => {
    if (!dir || wonRef.current) return false;
    const p = posRef.current;
    if (p.animTo) return false; // already animating, ignore
    const { dr, dc } = dirDelta(dir);
    const nr = p.r + dr;
    const nc = p.c + dc;
    if (!isOpen(mazeRef.current, nr, nc)) return false;
    if (moveStartRef.current == null) moveStartRef.current = performance.now();
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

  // Keyboard: movement, Esc to close, and a simple focus trap (the only
  // focusable control is the close button, so Tab just stays on it).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
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

    const lightCells = isTouch ? LIGHT_CELLS_TOUCH : LIGHT_CELLS_POINTER;

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
      const maze = mazeRef.current;
      const { W, H, target } = maze;
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

          if (!wonRef.current && p.r === target.r && p.c === target.c) {
            wonRef.current = true;
            winStartRef.current = now;
            const secs = Math.max(
              1,
              Math.round((now - (moveStartRef.current ?? now)) / 1000),
            );
            setWinSeconds(secs);
            const totalWait = reduce ? 1700 : 3200;
            closeTimerRef.current = setTimeout(() => {
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
      drawMaze(ctx, maze, offX, offY, cell, wonRef.current, winStartRef.current, now);
      drawTarget(ctx, maze, offX, offY, cell, wonRef.current, winStartRef.current, now);

      // 3. Spotlight. A pool of light around the bulb, fading to deep
      //    black across the rest of the maze. On win the pool blooms
      //    outward to reveal the whole room.
      const winT = wonRef.current && winStartRef.current
        ? Math.min(1, (now - winStartRef.current) / (reduce ? 320 : 520))
        : 0;
      const bloom = easeOutCubic(winT);
      const baseRadius = cell * lightCells;
      const maxBloom = Math.hypot(drawW, drawH) * 0.72;
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
        grad.addColorStop(0.32, "rgba(7,6,5,0)");
        grad.addColorStop(0.66, "rgba(4,3,2,0.6)");
        grad.addColorStop(0.85, "rgba(4,3,2,0.95)");
        grad.addColorStop(1, "rgba(4,3,2,1)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cssW, cssH);

        // 4. Distant beacon: a faint glow at the workspace that shows
        //    through the dark so there's always something to aim for.
        //    Drawn over the darkness with screen blend, fading out as the
        //    win bloom takes over.
        drawBeacon(ctx, target, offX, offY, cell, now, 1 - bloom);
      }

      // 5. Bulb on top, always glowing.
      drawBulb(ctx, ppos.x, ppos.y, cell, wonRef.current, winT);

      // 6. Win flare: a brief warm-white peak that softens into the
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
  }, [open, reduce, isTouch, onClose, onWin, tryMove, pickHeld]);

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
            <p className="font-mono text-[10.5px] tracking-[0.06em] text-brand-amber">
              illuminate · light maze
            </p>
            <h2
              className="font-display mt-3 leading-[1.02] text-text"
              style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}
            >
              {title}
            </h2>
            <p className="mt-2 leading-[1.4] text-text/65 md:text-lg">
              {subtitle}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="ignite shrink-0 rounded-md border border-hairline px-4 py-2 font-mono text-[11px] text-text/85 hover:border-[#f55e09] hover:text-brand-orange"
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

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 font-mono text-[11px] tracking-[0.03em] text-text-muted">
          {winSeconds != null ? (
            <span className="text-[14px] text-brand-amber">
              {winLine(winSeconds)}
            </span>
          ) : (
            <span>{hint}</span>
          )}
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
  maze: Maze,
  offX: number,
  offY: number,
  cell: number,
  won: boolean,
  winStart: number | null,
  now: number,
) {
  const { grid, W, H } = maze;
  const wall = (r: number, c: number) => grid[r * W + c] === 1;

  // Floors — warm but dim, only really seen inside the spotlight.
  ctx.fillStyle = "#1c1611";
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (wall(r, c)) continue;
      ctx.fillRect(offX + c * cell, offY + r * cell, cell, cell);
    }
  }

  // Walls — slightly warmer black so they read as objects when the
  // spotlight passes over them. A thin orange hairline along open
  // edges suggests filament light catching the corner of the wall.
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (!wall(r, c)) continue;
      const x = offX + c * cell;
      const y = offY + r * cell;
      ctx.fillStyle = "#0c0a08";
      ctx.fillRect(x, y, cell, cell);
      ctx.strokeStyle = "rgba(245,94,9,0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (r + 1 < H && !wall(r + 1, c)) {
        ctx.moveTo(x, y + cell);
        ctx.lineTo(x + cell, y + cell);
      }
      if (r - 1 >= 0 && !wall(r - 1, c)) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cell, y);
      }
      if (c + 1 < W && !wall(r, c + 1)) {
        ctx.moveTo(x + cell, y);
        ctx.lineTo(x + cell, y + cell);
      }
      if (c - 1 >= 0 && !wall(r, c - 1)) {
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
        if (wall(r, c)) continue;
        ctx.fillRect(offX + c * cell, offY + r * cell, cell, cell);
      }
    }
    ctx.globalAlpha = 1;
  }
}

// Faint pulsing glow at the goal, visible through the darkness so the
// player always has a bearing. Screen blend keeps it reading as light,
// not a painted blob. `fade` drops it out as the win bloom arrives.
function drawBeacon(
  ctx: CanvasRenderingContext2D,
  target: { r: number; c: number },
  offX: number,
  offY: number,
  cell: number,
  now: number,
  fade: number,
) {
  if (fade <= 0.001) return;
  const cx = offX + (target.c + 0.5) * cell;
  const cy = offY + (target.r + 0.5) * cell;
  const pulse = 0.7 + 0.3 * Math.sin(now / 620);
  const radius = cell * 2.6;
  const a = 0.5 * fade * pulse;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, `rgba(255,196,96,${(0.5 * a).toFixed(3)})`);
  grad.addColorStop(0.5, `rgba(249,167,29,${(0.22 * a).toFixed(3)})`);
  grad.addColorStop(1, "rgba(245,94,9,0)");
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = grad;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
}

function drawTarget(
  ctx: CanvasRenderingContext2D,
  maze: Maze,
  offX: number,
  offY: number,
  cell: number,
  won: boolean,
  winStart: number | null,
  now: number,
) {
  const { target } = maze;
  const cx = offX + (target.c + 0.5) * cell;
  const cy = offY + (target.r + 0.5) * cell;
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
