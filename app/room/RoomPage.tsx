"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SessionVideo } from "@/app/_components/SessionVideo";
import { LightMaze } from "@/app/_components/LightMaze";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { useDeclareVariant } from "@/app/_components/useVariant";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { media } from "@/lib/media";
import { roomScenes, statTooltip } from "@/lib/copy";

const INTRO_KEY = "illuminate_intro_seen";

export function RoomPage() {
  useDeclareVariant("room");
  const [gateOpen, setGateOpen] = useState(false);
  const reduce = useReducedMotion();

  // Decide whether to show the intro gate. Skipped under reduced motion
  // and once the visitor has seen it before.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(INTRO_KEY) === "1";
    } catch {
      seen = true;
    }
    if (!seen && !reduce) {
      const handle = setTimeout(() => setGateOpen(true), 0);
      return () => clearTimeout(handle);
    }
    if (!seen && reduce) {
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
      <SiteNav tone="light" />
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
        open={gateOpen}
        onClose={dismissGate}
        variant="gate"
        title="Find the workspace."
        subtitle="Switch the room on. The page is waiting on the other side."
      />
    </main>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative h-[120svh] w-full bg-black">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <SessionVideo
          clip={media.roomHero}
          variant="hero"
          eager
          showMuteToggle
          className="h-full w-full"
        />

        <div className="font-ui absolute left-6 top-24 z-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/80 md:left-10">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#f9a71d]"
          />
          Session in progress
        </div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="font-ui absolute inset-x-0 bottom-8 z-10 flex justify-center text-[10px] uppercase tracking-[0.3em] text-white/75"
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
    <Scene eyebrow={scene.eyebrow} dark>
      <Statement>
        Most Copilot rollouts{" "}
        <em className="italic text-[#f9a71d]">happen in the dark.</em>
      </Statement>
      <Body>{scene.sub}</Body>
      <div className="mt-16">
        <SessionVideo
          clip={media.roomScenes.room}
          variant="scene"
          className="rounded-sm"
          label="Wide of the room, give it a sec"
        />
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
      <div className="grid items-start gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Statement size="lg">
            <span className="block">This is what it looks like</span>
            <span className="block italic text-[#f9a71d]">
              when the lights come on.
            </span>
          </Statement>
          <Body className="mt-8">{scene.sub}</Body>
        </div>
        <div className="md:col-span-7">
          <SessionVideo
            clip={media.roomScenes.breakthrough}
            variant="scene"
            className="rounded-sm"
            label="Real footage, warming up"
          />
          <p className="font-ui mt-4 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
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
    <Scene eyebrow={scene.eyebrow} dark>
      <Statement size="lg">
        We train the role,{" "}
        <em className="italic text-[#f9a71d]">not the feature list.</em>
      </Statement>
      <Body>{scene.sub}</Body>
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
  const numberScale = useTransform(scrollYProgress, [0, 0.4], [0.7, 1]);
  const numberY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const lightsOn = useSceneLights(inner);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[#f4ede0]/10 bg-[#0a0907] py-32 md:py-44"
    >
      <div
        ref={inner}
        className={`mx-auto max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
          {scene.eyebrow}
        </p>

        <motion.div
          style={{
            scale: numberScale,
            y: numberY,
            opacity: numberOpacity,
          }}
          className="mt-12"
          title={statTooltip}
        >
          <div
            className="font-display leading-[0.78] tracking-tight"
            style={{
              color: "#f55e09",
              fontSize: "clamp(8rem, 28vw, 28rem)",
              fontVariationSettings: '"opsz" 144',
            }}
          >
            82%
          </div>
        </motion.div>

        <p className="font-display mt-8 max-w-[26ch] text-3xl italic leading-[1.05] text-[#f4ede0] md:text-5xl">
          adoption in eight weeks.
        </p>
        <p className="font-serif-text mt-6 max-w-[44ch] text-xl italic leading-[1.4] text-[#f4ede0]/80 md:text-2xl">
          {scene.sub}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Scene 06 ---------------- */

function Scene06() {
  const scene = roomScenes[5];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <Statement size="lg">
        <span className="block">MSPs, you do not have to</span>
        <span className="block italic text-[#f9a71d]">become the trainer.</span>
      </Statement>
      <Body>{scene.sub}</Body>
      <div className="mt-12">
        <Link
          href="/for-msps"
          className="ignite-text font-ui inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-[#f9a71d] hover:text-[#f55e09]"
        >
          Partner with us
          <span aria-hidden>→</span>
        </Link>
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
  const lift = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const lightsOn = useSceneLights(inner);
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#f4ede0] py-32 text-[#0b0a08] md:py-44"
    >
      <div
        ref={inner}
        className={`mx-auto max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#0b0a08]/55">
          {scene.eyebrow}
        </p>
        <motion.div style={{ y: lift }}>
          <h2
            className="font-display mt-6 leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(3rem, 9vw, 10rem)" }}
          >
            <span className="block">Ready to switch</span>
            <span className="block italic text-[#f55e09]">
              the lights on?
            </span>
          </h2>
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          {"primaryCta" in scene && scene.primaryCta && (
            <Link
              href={scene.primaryCta.href}
              className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-8 py-4 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
            >
              {scene.primaryCta.label}
              <span aria-hidden>→</span>
            </Link>
          )}
          {"secondaryCta" in scene && scene.secondaryCta && (
            <Link
              href={scene.secondaryCta.href}
              className="font-serif-text ignite-text text-2xl italic text-[#0b0a08] underline decoration-[#f55e09] decoration-2 underline-offset-4 hover:text-[#f55e09]"
            >
              {scene.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Shared scene primitives ---------------- */

function Scene({
  eyebrow,
  children,
  dark = false,
}: {
  eyebrow: string;
  children: React.ReactNode;
  dark?: boolean;
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
      className={`relative overflow-hidden py-32 md:py-44 ${
        dark ? "bg-black" : "bg-[#0a0907]"
      } text-[#f4ede0]`}
    >
      <motion.div
        style={{ opacity, y }}
        className={`mx-auto max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
          {eyebrow}
        </span>
        <div className="mt-10">{children}</div>
      </motion.div>
    </section>
  );
}

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
      ? "clamp(3.5rem, 11vw, 11rem)"
      : size === "lg"
        ? "clamp(2.75rem, 8vw, 7.5rem)"
        : "clamp(2.25rem, 6vw, 5.5rem)";
  return (
    <h2
      className="font-display leading-[0.9] tracking-tight"
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
      className={`font-serif-text mt-10 max-w-[48ch] text-xl italic leading-[1.35] text-[#f4ede0]/85 md:text-2xl ${className}`}
    >
      {children}
    </p>
  );
}
