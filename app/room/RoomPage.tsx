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
import { StudioSpotlight } from "@/app/_components/StudioSpotlight";
import { LightMaze } from "@/app/_components/LightMaze";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { media } from "@/lib/media";
import {
  caseStudy,
  company,
  headlineNumber,
  roomScenes,
} from "@/lib/copy";

const INTRO_KEY = "illuminate_intro_seen";

export function RoomPage() {
  const [navVisible, setNavVisible] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavVisible(latest > 320);
  });

  // Decide whether to show the intro gate. Skipped under reduced motion
  // and once the visitor has seen it before. State is flipped via a
  // microtask so we don't trigger a cascading render inside the effect.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(INTRO_KEY) === "1";
    } catch {
      // Storage unavailable — treat as seen so the gate never blocks.
      seen = true;
    }
    if (!seen && !reduce) {
      const handle = setTimeout(() => setGateOpen(true), 0);
      return () => clearTimeout(handle);
    }
    if (!seen && reduce) {
      // Reduced motion: still mark seen so we don't try again next visit.
      try {
        window.localStorage.setItem(INTRO_KEY, "1");
      } catch {}
    }
  }, [reduce]);

  const dismissGate = () => {
    setGateOpen(false);
    try {
      window.localStorage.setItem(INTRO_KEY, "1");
    } catch {}
  };

  return (
    <main className="font-ui min-h-dvh bg-[#0a0907] text-[#f4ede0]">
      <EmergingNav visible={navVisible} />
      <Hero />
      <SceneRoom />
      <SceneProblem />
      <SceneBreakthrough />
      <SceneResult />
      <SceneInvitation />
      <RoomFooter />
      <LightMaze
        open={gateOpen}
        onClose={dismissGate}
        variant="gate"
        title="Find the workspace."
        subtitle="Switch the room on. The page is waiting on the other side."
      />
    </main>
  );
}

function EmergingNav({ visible }: { visible: boolean }) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-[#f4ede0]/10 bg-[#0a0907]/80 backdrop-blur-md transition-all duration-500 supports-[backdrop-filter]:bg-[#0a0907]/65 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <Link
          href="/"
          className="font-display text-xl italic tracking-tight text-[#f4ede0]"
        >
          Illuminate
        </Link>
        <a
          href={`mailto:${company.email}?subject=Booking%20an%20Illuminate%20session`}
          className="font-ui ignite inline-flex items-center gap-2 rounded-full border border-[#f4ede0]/30 bg-[#f4ede0]/5 px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0] transition hover:border-[#f55e09] hover:bg-[#f55e09] hover:text-white"
        >
          Book a session
        </a>
      </div>
    </header>
  );
}

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

        {/* Top-left orientation chrome, minimal */}
        <div className="font-ui absolute left-6 top-6 z-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/80 md:left-10 md:top-8">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#f9a71d]"
          />
          Illuminate · Session in progress
        </div>

        {/* The 82% reveal — appears via motion as you arrive.
            Non-interactive so the unmute control underneath stays clickable.
            Centred vertically and sized off both vw and vh so the whole
            number always fits within the visible area. */}
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

function SceneRoom() {
  const scene = roomScenes[0];
  return (
    <Scene
      eyebrow={scene.eyebrow}
      kicker="You did not arrive at the start."
    >
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <Statement>
            {scene.title.split(". ").map((line, i) => (
              <span key={i} className="block">
                {line}
                {i === 0 ? "." : ""}
              </span>
            ))}
          </Statement>
          <Body className="mt-6">{scene.body}</Body>
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

function SceneProblem() {
  const scene = roomScenes[1];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <Statement size="xl">
            <span className="block text-[#f4ede0]">Every team has the tools.</span>
            <span className="block italic text-[#f55e09]">
              Far fewer have the skills.
            </span>
          </Statement>
          <Body className="mt-6">{scene.body}</Body>
        </div>
        <div className="md:col-span-6">
          <SceneVideoFrame>
            <SessionVideo
              clip={media.roomScenes.problem}
              variant="fill"
              className="h-full w-full"
              label="The problem, still warming up"
            />
          </SceneVideoFrame>
        </div>
      </div>
    </Scene>
  );
}

function SceneBreakthrough() {
  const scene = roomScenes[2];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <Statement size="lg">
            <span className="block">A workflow</span>
            <span className="block italic text-[#f9a71d]">tilts.</span>
          </Statement>
          <Body className="mt-6">{scene.body}</Body>
        </div>
        <div className="md:col-span-7">
          <SceneVideoFrame>
            <SessionVideo
              clip={media.roomScenes.breakthrough}
              variant="fill"
              className="h-full w-full"
              label="Breakthrough, mid-rebake"
            />
          </SceneVideoFrame>
          <p className="font-ui mt-3 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
            Recorded in the room. Names withheld until clients clear release.
          </p>
        </div>
      </div>
    </Scene>
  );
}

function SceneResult() {
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
        <div className="flex items-baseline gap-6">
          <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
            {roomScenes[3].eyebrow}
          </span>
          <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/45">
            Eight weeks later.
          </span>
        </div>

        <div className="mt-6 grid items-center gap-8 md:mt-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6">
            <motion.div
              style={{
                scale: numberScale,
                y: numberY,
                opacity: numberOpacity,
              }}
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
              Copilot adoption across the cohort. Industry norm sits closer to
              thirty.
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
            <blockquote className="font-serif-text mt-5 max-w-[48ch] text-base leading-[1.4] text-[#f4ede0]/85 md:text-lg">
              <span className="text-[#f55e09]">&ldquo;</span>
              {caseStudy.quote}
              <span className="text-[#f55e09]">&rdquo;</span>
              <footer className="font-ui mt-3 text-[11px] uppercase not-italic tracking-[0.22em] text-[#f4ede0]/55">
                {caseStudy.attribution}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function SceneInvitation() {
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
          {roomScenes[4].eyebrow}
        </p>
        <motion.div style={{ y: lift }}>
          <h2
            className="font-display mt-5 leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}
          >
            <span className="block">Come and</span>
            <span className="block italic text-[#f55e09]">sit in.</span>
          </h2>
        </motion.div>

        <p className="font-serif-text mt-6 max-w-[44ch] text-lg italic leading-[1.3] text-[#0b0a08]/85 md:text-xl">
          We run cohorts continuously. The next session has space, and the one
          after will not.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href={`mailto:${company.email}?subject=Booking%20an%20Illuminate%20session`}
            className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
          >
            Book a session
            <span aria-hidden>→</span>
          </a>
          <a
            href={`mailto:${company.email}`}
            className="font-serif-text ignite-text text-xl italic text-[#0b0a08] underline decoration-[#f55e09] decoration-2 underline-offset-4 hover:text-[#f55e09]"
          >
            {company.email}
          </a>
        </div>
      </div>
    </section>
  );
}

function RoomFooter() {
  return (
    <footer>
      <div className="bg-[#0b0a08]">
        <div className="mx-auto max-w-[1500px] px-6 pt-20 pb-10 md:px-10 md:pt-24 md:pb-14">
          <StudioSpotlight />
        </div>
      </div>
      <div className="bg-[#0a0907]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-baseline justify-between gap-4 border-t border-[#f4ede0]/10 px-6 py-10 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55 md:px-10">
          <span className="font-display text-xl not-italic tracking-tight text-[#f4ede0]">
            Illuminate Learning
          </span>
          <span>Pembrokeshire · {company.email}</span>
          <Link href="/session" className="hover:text-[#f55e09]">
            Conventional version: /session
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ---------- shared scene primitives ---------- */

function Scene({
  eyebrow,
  kicker,
  children,
}: {
  eyebrow: string;
  kicker?: string;
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
        <div className="flex items-baseline gap-6">
          <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
            {eyebrow}
          </span>
          {kicker && (
            <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/45">
              {kicker}
            </span>
          )}
        </div>
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
      ? "clamp(2.25rem, 5.5vw, 4.75rem)"
      : size === "lg"
        ? "clamp(2rem, 4.8vw, 4rem)"
        : "clamp(1.75rem, 4vw, 3.25rem)";
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

// Wrapper that constrains a scene video so it never escapes the 100dvh frame.
// Fixed 16/9 ratio with a viewport-height cap; the video covers within.
// max-width keeps the aspect ratio honoured even when the height cap is binding.
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
