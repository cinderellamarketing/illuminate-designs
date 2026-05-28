"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SessionVideo } from "@/app/_components/SessionVideo";
import { BulbMark } from "@/app/_components/BulbMark";
import { LightMaze } from "@/app/_components/LightMaze";
import { LightSwitchGate } from "@/app/_components/LightSwitchGate";
import { KonamiFlourish } from "@/app/_components/KonamiFlourish";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { useDeclareVariant } from "@/app/_components/useVariant";
import { useLightEggs } from "@/app/_components/useLightEggs";
import { media } from "@/lib/media";
import {
  company,
  headlineNumber,
  nav,
  roomScenes,
  statTooltip,
} from "@/lib/copy";

// /room is the cinematic homepage. The shared light-switch gate now
// handles the first-visit intro (see LightSwitchGate); the maze lives on
// here only as an easter egg, opened from the nav bulb or the Konami
// code, matching /session. The hero parallax-lifts the 82%, and the
// seven docx scenes play out in contained 100svh shells.
//
// EmergingNav is intentionally not the shared SiteNav — the cinematic
// frame wants its chrome to fade in once the visitor has scrolled past
// the hero, not sit at the top of the page from load. The SiteFooter
// at the end provides full navigation to the inner pages.
export function RoomPage() {
  useDeclareVariant("room");
  const [navVisible, setNavVisible] = useState(false);
  const { mazeOpen, closeMaze, handleBulb, bulbBlown, flourishing } =
    useLightEggs();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavVisible(latest > 320);
  });

  return (
    <main className="font-ui min-h-dvh bg-[#0a0907] text-[#f4ede0]">
      <EmergingNav
        visible={navVisible}
        onBulb={handleBulb}
        bulbBlown={bulbBlown}
      />
      <Hero />
      <Scene01 />
      <Scene02 />
      <Scene03 />
      <Scene04 />
      <Scene05 />
      <Scene06 />
      <Scene07 />
      <SiteFooter />
      <LightMaze
        open={mazeOpen}
        onClose={closeMaze}
        variant="modal"
        title="The bulb wants a moment."
        subtitle="Find the workspace. We'll light it up."
      />
      <KonamiFlourish active={flourishing} />
      <LightSwitchGate />
    </main>
  );
}

// Full site nav, hidden during the hero so the cinematic frame is
// uninterrupted, fading in once the visitor has scrolled past it. The
// link set matches the shared SiteNav used on /session and the inner
// pages, so the rest of the site is visible from /room not just the
// footer. A compact "menu" toggle on small screens reveals the same
// link list in a stacked panel.
function EmergingNav({
  visible,
  onBulb,
  bulbBlown = false,
}: {
  visible: boolean;
  onBulb?: () => void;
  bulbBlown?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-[#f4ede0]/10 bg-[#0a0907]/85 backdrop-blur-md transition-all duration-500 supports-[backdrop-filter]:bg-[#0a0907]/65 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-6 py-4 md:px-10 md:py-5">
        <div className="flex items-center gap-3">
          <BulbMark
            tone="light"
            size={22}
            onClick={onBulb}
            blown={bulbBlown}
            ariaLabel="Illuminate"
            title={
              bulbBlown ? "Ouch." : "It does something. Easy on the clicks."
            }
          />
          <Link
            href="/"
            className="font-display ignite-text text-xl italic tracking-tight text-[#f4ede0]"
          >
            Illuminate
          </Link>
        </div>

        <nav className="hidden items-center gap-7 text-[12px] uppercase tracking-[0.18em] text-[#f4ede0]/75 md:flex">
          {nav.links
            .filter((l) => l.href !== "/")
            .map((l) => (
              <Link key={l.label} href={l.href} className="ignite-text">
                {l.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={nav.primaryCta.href}
            className="font-ui ignite inline-flex items-center gap-2 rounded-full border border-[#f4ede0]/30 bg-[#f4ede0]/5 px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0] transition hover:border-[#f55e09] hover:bg-[#f55e09] hover:text-white"
          >
            {nav.primaryCta.label}
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="room-nav-mobile"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="ignite font-ui inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f4ede0]/25 text-[#f4ede0] md:hidden"
          >
            <span aria-hidden className="text-base leading-none">
              {menuOpen ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      <div
        id="room-nav-mobile"
        hidden={!menuOpen}
        className="border-t border-[#f4ede0]/10 md:hidden"
      >
        <nav className="mx-auto flex max-w-[1500px] flex-col gap-1 px-6 py-4 text-[#f4ede0]">
          {nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="ignite-text rounded-md py-2 text-[13px] uppercase tracking-[0.18em]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Number stays small initially, then enlarges and lifts as you arrive.
  const numberScale = useTransform(scrollYProgress, [0, 0.35], [0.9, 1]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85], [0, 1, 1]);
  // Gentle parallax that never lifts the number out of the viewport.
  const numberY = useTransform(scrollYProgress, [0, 1], [20, -40]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative h-[140svh] w-full bg-[#0a0907]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <SessionVideo
          clip={media.roomHero}
          variant="hero"
          eager
          showMuteToggle
          className="h-full w-full"
        />

        {/* Top-left orientation chrome, minimal. */}
        <div className="font-ui absolute left-6 top-6 z-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/80 md:left-10 md:top-8">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#f9a71d]"
          />
          Illuminate · Session in progress
        </div>

        {/* The 82% reveal — appears via motion as you arrive. The
            container is non-interactive so the unmute control underneath
            stays clickable; only the actual CTAs opt back in. Sized off
            both vw and svh so the whole number always fits within the
            visible area. */}
        <motion.div
          style={{
            scale: numberScale,
            opacity: numberOpacity,
            y: numberY,
          }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
        >
          <div
            className="font-display text-center leading-[0.82] tracking-tight"
            title={statTooltip}
            style={{
              color: "#f55e09",
              fontSize: "min(26vw, 44svh)",
              fontVariationSettings: '"opsz" 144',
              textShadow: "0 4px 60px rgba(0,0,0,0.55)",
            }}
          >
            {headlineNumber.value}
          </div>
          <p
            className="font-display mt-6 max-w-xl px-2 text-center text-lg italic leading-[1.2] text-white md:text-xl"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}
          >
            Copilot adoption in eight weeks. The industry average sits around
            30%.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="font-ui absolute inset-x-0 bottom-6 z-10 flex justify-center text-[10px] uppercase tracking-[0.3em] text-white/70"
        >
          <span className="flex items-center gap-3">
            <span aria-hidden>↓</span>
            Scroll into the room
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Scene 01 ---------------- */

function Scene01() {
  const scene = roomScenes[0];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <Statement>
            Most Copilot rollouts{" "}
            <em className="italic text-[#f9a71d]">happen in the dark.</em>
          </Statement>
          <Body className="mt-6">{scene.sub}</Body>
        </div>
        <div className="md:col-span-6">
          <SceneVideoFrame>
            <SessionVideo
              clip={media.roomScenes.room}
              variant="fill"
              className="h-full w-full"
              label="Wide of the room, give it a sec"
            />
          </SceneVideoFrame>
        </div>
      </div>
    </Scene>
  );
}

/* ---------------- Scene 02 ---------------- */

function Scene02() {
  const scene = roomScenes[1];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <Statement size="xl">
        <span className="block text-[#f4ede0]">{scene.line}</span>
        <span className="block italic text-[#f55e09]">
          {"line2" in scene ? scene.line2 : ""}
        </span>
      </Statement>
    </Scene>
  );
}

/* ---------------- Scene 03 ---------------- */

function Scene03() {
  const scene = roomScenes[2];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <Statement size="lg">
            <span className="block">This is what it looks like</span>
            <span className="block italic text-[#f9a71d]">
              when the lights come on.
            </span>
          </Statement>
          <Body className="mt-6">{scene.sub}</Body>
        </div>
        <div className="md:col-span-7">
          <SceneVideoFrame>
            <SessionVideo
              clip={media.roomScenes.breakthrough}
              variant="fill"
              className="h-full w-full"
              label="Real footage, warming up"
            />
          </SceneVideoFrame>
          <p className="font-ui mt-3 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
            Real footage plays here.
          </p>
        </div>
      </div>
    </Scene>
  );
}

/* ---------------- Scene 04 ---------------- */

function Scene04() {
  const scene = roomScenes[3];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <Statement size="lg">
            We train the role,{" "}
            <em className="italic text-[#f9a71d]">not the feature list.</em>
          </Statement>
          <Body className="mt-6">{scene.sub}</Body>
        </div>
        <div className="md:col-span-5">
          <SceneVideoFrame>
            <SessionVideo
              clip={media.roomScenes.problem}
              variant="fill"
              className="h-full w-full"
              label="The room, mid-session"
            />
          </SceneVideoFrame>
        </div>
      </div>
    </Scene>
  );
}

/* ---------------- Scene 05 ---------------- */

function Scene05() {
  const scene = roomScenes[4];
  const ref = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });
  const numberScale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);
  const numberY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const lightsOn = useSceneLights(inner);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#0a0907] py-14 md:py-16"
    >
      <div
        ref={inner}
        className={`mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
          {scene.eyebrow}
        </span>

        <div className="mt-6 grid items-center gap-8 md:mt-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6">
            <motion.div
              style={{
                scale: numberScale,
                y: numberY,
                opacity: numberOpacity,
              }}
              title={statTooltip}
            >
              <div
                className="font-display leading-[0.85] tracking-tight"
                style={{
                  color: "#f55e09",
                  fontSize: "min(22vw, 38svh)",
                  fontVariationSettings: '"opsz" 144',
                }}
              >
                {headlineNumber.value}
              </div>
            </motion.div>
            <p className="font-serif-text mt-5 max-w-[36ch] text-base italic leading-[1.35] text-[#f4ede0] md:text-lg">
              adoption in eight weeks.
            </p>
          </div>

          <div className="md:col-span-6">
            <SceneVideoFrame>
              <SessionVideo
                clip={media.roomScenes.result}
                variant="fill"
                className="h-full w-full"
                label="Eight weeks later, cuppa optional"
              />
            </SceneVideoFrame>
            <p className="font-serif-text mt-5 max-w-[44ch] text-base italic leading-[1.4] text-[#f4ede0]/85 md:text-lg">
              {scene.sub}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Scene 06 ---------------- */

function Scene06() {
  const scene = roomScenes[5];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <Statement size="lg">
            <span className="block">MSPs, you do not have to</span>
            <span className="block italic text-[#f9a71d]">
              become the trainer.
            </span>
          </Statement>
          <Body className="mt-6">{scene.sub}</Body>
          <div className="mt-6">
            <Link
              href="/for-msps"
              className="ignite-text font-ui inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-[#f9a71d] hover:text-[#f55e09]"
            >
              Partner with us
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <SceneVideoFrame>
            <SessionVideo
              clip={media.roomScenes.breakthrough}
              variant="fill"
              className="h-full w-full"
              label="Channel partner, day two"
            />
          </SceneVideoFrame>
        </div>
      </div>
    </Scene>
  );
}

/* ---------------- Scene 07 ---------------- */

function Scene07() {
  const scene = roomScenes[6];
  const ref = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const lift = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const lightsOn = useSceneLights(inner);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#f4ede0] py-14 text-[#0b0a08] md:py-16"
    >
      <div
        ref={inner}
        className={`mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#0b0a08]/55">
          {scene.eyebrow}
        </p>
        <motion.div style={{ y: lift }}>
          <h2
            className="font-display mt-5 leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}
          >
            <span className="block">Ready to switch</span>
            <span className="block italic text-[#f55e09]">
              the lights on?
            </span>
          </h2>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          {"primaryCta" in scene && scene.primaryCta && (
            <Link
              href={scene.primaryCta.href}
              className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
            >
              {scene.primaryCta.label}
              <span aria-hidden>→</span>
            </Link>
          )}
          {"secondaryCta" in scene && scene.secondaryCta && (
            <Link
              href={scene.secondaryCta.href}
              className="font-serif-text ignite-text text-xl italic text-[#0b0a08] underline decoration-[#f55e09] decoration-2 underline-offset-4 hover:text-[#f55e09]"
            >
              {scene.secondaryCta.label}
            </Link>
          )}
          <a
            href={`mailto:${company.email}`}
            className="font-ui ignite-text text-[12px] uppercase tracking-[0.22em] text-[#0b0a08]/65 hover:text-[#f55e09]"
          >
            {company.email}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Shared scene primitives ---------------- */

function Scene({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.25], [40, 0]);
  const lightsOn = useSceneLights(ref);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#0a0907] py-14 text-[#f4ede0] md:py-16"
    >
      <motion.div
        style={{ opacity, y }}
        className={`mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
          {eyebrow}
        </span>
        <div className="mt-6 md:mt-8">{children}</div>
      </motion.div>
    </section>
  );
}

// Toggle the scene from dim to lit when it scrolls into view.
function useSceneLights(ref: React.RefObject<HTMLDivElement | null>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setOn(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

function Statement({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  const fontSize =
    size === "xl"
      ? "clamp(2.5rem, 7vw, 6.5rem)"
      : size === "lg"
        ? "clamp(2rem, 5.2vw, 4.5rem)"
        : "clamp(1.75rem, 4.4vw, 3.6rem)";
  return (
    <h2
      className="font-display leading-[0.95] tracking-tight"
      style={{ fontSize, fontVariationSettings: '"opsz" 144' }}
    >
      {children}
    </h2>
  );
}

function Body({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-serif-text max-w-[48ch] text-base italic leading-[1.4] text-[#f4ede0]/85 md:text-lg ${className}`}
    >
      {children}
    </p>
  );
}

// Wrapper that constrains a scene video so it never escapes the 100dvh
// frame. Fixed 16/9 ratio with a viewport-height cap; the video covers
// within. max-width keeps the aspect honoured even when the height cap
// binds.
function SceneVideoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto overflow-hidden rounded-sm"
      style={{
        aspectRatio: "16 / 9",
        width: "100%",
        maxWidth: "calc(42svh * 16 / 9)",
      }}
    >
      {children}
    </div>
  );
}
