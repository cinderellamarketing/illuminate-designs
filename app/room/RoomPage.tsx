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
import { StatMeter } from "@/app/_components/StatMeter";
import { BulbMark } from "@/app/_components/BulbMark";
import { LightMaze } from "@/app/_components/LightMaze";
import { LightSwitchGate } from "@/app/_components/LightSwitchGate";
import { KonamiFlourish } from "@/app/_components/KonamiFlourish";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { useDeclareVariant } from "@/app/_components/useVariant";
import { useLightEggs } from "@/app/_components/useLightEggs";
import { media } from "@/lib/media";
import { company, headlineNumber, nav, roomScenes, statTooltip } from "@/lib/copy";

const STAT = parseInt(headlineNumber.value, 10) || 82;

// /room is the cinematic homepage. The shared light-switch gate handles
// the first-visit intro; the maze lives on as an easter egg from the nav
// bulb or the Konami code, matching /session. The hero parallax-lifts the
// 82% stat and the seven docx scenes play out in contained 100svh shells.
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
    <main className="font-sans min-h-dvh bg-ground text-text">
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
// uninterrupted, fading in once the visitor has scrolled past it.
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
      className={`fixed inset-x-0 top-0 z-40 border-b border-hairline bg-ground/85 backdrop-blur-md transition-all duration-500 supports-[backdrop-filter]:bg-ground/70 ${
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
            className="font-display ignite-text text-lg tracking-tight text-text"
          >
            Illuminate
          </Link>
        </div>

        <nav className="hidden items-center gap-7 font-mono text-[12.5px] text-text-muted md:flex">
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
            className="btn btn-primary btn-sm ignite"
          >
            {nav.primaryCta.label}
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="room-nav-mobile"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="ignite inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline text-text md:hidden"
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
        className="border-t border-hairline md:hidden"
      >
        <nav className="mx-auto flex max-w-[1500px] flex-col gap-1 px-6 py-4 text-text">
          {nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="ignite-text rounded-md py-2 font-mono text-[13px]"
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
  const numberScale = useTransform(scrollYProgress, [0, 0.35], [0.9, 1]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85], [0, 1, 1]);
  const numberY = useTransform(scrollYProgress, [0, 1], [20, -40]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative h-[140svh] w-full bg-ground">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <SessionVideo
          clip={media.roomHero}
          variant="hero"
          eager
          showMuteToggle
          className="h-full w-full"
        />

        {/* Top-left status chrome — a live indicator, mono. */}
        <div className="absolute left-6 top-6 z-10 flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-text/80 md:left-10 md:top-8">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-brand-amber"
            style={{ boxShadow: "0 0 8px rgba(249,167,29,0.8)" }}
          />
          Illuminate · session in progress
        </div>

        {/* The 82% reveal, as a mono gauge. Non-interactive wrapper keeps
            the unmute control underneath clickable. */}
        <motion.div
          style={{ scale: numberScale, opacity: numberOpacity, y: numberY }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
        >
          <StatMeter
            value={STAT}
            align="center"
            caption="Copilot adoption in eight weeks."
            tooltip={statTooltip}
            fontSize="min(24vw, 40svh)"
            meterMaxWidth="min(70vw, 440px)"
          />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute inset-x-0 bottom-6 z-10 flex justify-center font-mono text-[11px] tracking-[0.08em] text-text/70"
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
            <span className="text-brand-amber">happen in the dark.</span>
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
        <span className="block">{scene.line}</span>
        <span className="block text-brand-orange">
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
            <span className="block text-brand-amber">
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
          <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-text-muted">
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
            <span className="text-brand-amber">not the feature list.</span>
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
  const lightsOn = useSceneLights(inner);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ground py-14 md:py-16"
    >
      <div
        ref={inner}
        className={`mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <span className="font-mono text-[11px] tracking-[0.04em] text-brand-amber">
          {scene.eyebrow}
        </span>

        <div className="mt-6 grid items-center gap-8 md:mt-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6">
            <StatMeter
              value={STAT}
              caption="adoption in eight weeks."
              tooltip={statTooltip}
              fontSize="min(20vw, 34svh)"
              meterMaxWidth="380px"
            />
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
            <p className="mt-5 max-w-[44ch] leading-[1.6] text-text/80">
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
            <span className="block text-brand-amber">become the trainer.</span>
          </Statement>
          <Body className="mt-6">{scene.sub}</Body>
          <div className="mt-6">
            <Link
              href="/for-msps"
              className="ignite-text inline-flex items-center gap-3 font-mono text-[13px] text-brand-amber hover:text-brand-orange"
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

  // The final scene is the room with the lights fully up: a warmer raised
  // surface with a strong resting light pool, rather than the cream flip.
  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden border-t border-hairline bg-surface-2 py-14 md:py-16"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-10%", left: "10%", width: "80%", height: "130%" }}
      />
      <div
        ref={inner}
        className={`relative mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <p className="font-mono text-[11px] tracking-[0.04em] text-brand-amber">
          {scene.eyebrow}
        </p>
        <motion.div style={{ y: lift }}>
          <h2
            className="font-display mt-5 leading-[0.96]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}
          >
            <span className="block">Ready to switch</span>
            <span className="block text-brand-orange">the lights on?</span>
          </h2>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          {"primaryCta" in scene && scene.primaryCta && (
            <Link
              href={scene.primaryCta.href}
              className="btn btn-primary btn-lg ignite"
            >
              <span aria-hidden className="btn-switch" />
              {scene.primaryCta.label}
            </Link>
          )}
          {"secondaryCta" in scene && scene.secondaryCta && (
            <Link
              href={scene.secondaryCta.href}
              className="btn btn-secondary btn-lg ignite"
            >
              {scene.secondaryCta.label}
            </Link>
          )}
          <a
            href={`mailto:${company.email}`}
            className="ignite-text font-mono text-[13px] text-text-muted hover:text-brand-orange"
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
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ground py-14 md:py-16"
    >
      <motion.div
        style={{ opacity, y }}
        className={`mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <span className="font-mono text-[11px] tracking-[0.04em] text-brand-amber">
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
      className="font-display leading-[0.98]"
      style={{ fontSize }}
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
      className={`max-w-[48ch] leading-[1.6] text-text/80 md:text-lg ${className}`}
    >
      {children}
    </p>
  );
}

// Wrapper that constrains a scene video so it never escapes the 100dvh
// frame. Fixed 16/9 ratio with a viewport-height cap; the video covers
// within.
function SceneVideoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto overflow-hidden rounded-lg"
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
