"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { SessionVideo } from "@/app/_components/SessionVideo";
import { media } from "@/lib/media";
import {
  caseStudy,
  company,
  headlineNumber,
  roomScenes,
} from "@/lib/copy";

export function RoomPage() {
  const [navVisible, setNavVisible] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setNavVisible(latest > 320);
  });

  return (
    <main className="font-ui min-h-dvh bg-[#0a0907] text-[#f4ede0]">
      <EmergingNav visible={navVisible} />
      <Hero />
      <SceneRoom />
      <SceneProblem />
      <SceneBreakthrough />
      <SceneResult />
      <SceneInvitation />
    </main>
  );
}

function EmergingNav({ visible }: { visible: boolean }) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-display text-xl italic tracking-tight text-[#f4ede0]"
        >
          Illuminate
        </Link>
        <a
          href={`mailto:${company.email}?subject=Booking%20an%20Illuminate%20session`}
          className="font-ui inline-flex items-center gap-2 rounded-full border border-[#f4ede0]/30 bg-[#f4ede0]/5 px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0] backdrop-blur transition hover:border-[#f55e09] hover:bg-[#f55e09] hover:text-white"
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
  const numberScale = useTransform(scrollYProgress, [0, 0.35], [0.85, 1]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85], [0, 1, 1]);
  const numberY = useTransform(scrollYProgress, [0, 1], [40, -120]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative h-[140svh] w-full bg-black">
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
            Non-interactive so the unmute control underneath stays clickable. */}
        <motion.div
          style={{
            scale: numberScale,
            opacity: numberOpacity,
            y: numberY,
          }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[12vh]"
        >
          <div
            className="font-display text-center leading-[0.78] tracking-tight"
            style={{
              color: "#f55e09",
              fontSize: "clamp(10rem, 32vw, 32rem)",
              fontVariationSettings: '"opsz" 144',
              textShadow: "0 4px 60px rgba(0,0,0,0.55)",
            }}
          >
            {headlineNumber.value}
          </div>
          <p
            className="font-display mt-6 max-w-2xl px-6 text-center text-2xl italic leading-[1.15] text-white md:text-3xl"
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
      <Statement>
        {scene.title.split(". ").map((line, i) => (
          <span key={i} className="block">
            {line}
            {i === 0 ? "." : ""}
          </span>
        ))}
      </Statement>

      <Body>{scene.body}</Body>

      <div className="mt-16">
        <SessionVideo
          clip={media.roomScenes.room}
          variant="scene"
          className="rounded-sm"
          label="Wide of the room to follow"
        />
      </div>
    </Scene>
  );
}

function SceneProblem() {
  const scene = roomScenes[1];
  return (
    <Scene eyebrow={scene.eyebrow} dark>
      <Statement size="xl">
        <span className="block text-[#f4ede0]">Every team has the tools.</span>
        <span className="block italic text-[#f55e09]">
          Far fewer have the skills.
        </span>
      </Statement>
      <Body>{scene.body}</Body>
      <div className="mt-16">
        <SessionVideo
          clip={media.roomScenes.problem}
          variant="scene"
          className="rounded-sm"
          label="The problem in the room"
        />
      </div>
    </Scene>
  );
}

function SceneBreakthrough() {
  const scene = roomScenes[2];
  return (
    <Scene eyebrow={scene.eyebrow}>
      <div className="grid items-start gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Statement size="lg">
            <span className="block">A workflow</span>
            <span className="block italic text-[#f9a71d]">tilts.</span>
          </Statement>
          <Body className="mt-8">{scene.body}</Body>
        </div>
        <div className="md:col-span-7">
          <SessionVideo
            clip={media.roomScenes.breakthrough}
            variant="scene"
            className="rounded-sm"
            label="Breakthrough moment to follow"
          />
          <p className="font-ui mt-4 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
            Recorded in the room. Names withheld until clients clear release.
          </p>
        </div>
      </div>
    </Scene>
  );
}

function SceneResult() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });
  const numberScale = useTransform(scrollYProgress, [0, 0.4], [0.7, 1]);
  const numberY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-[#f4ede0]/10 bg-[#0a0907] py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
          {roomScenes[3].eyebrow}
        </p>
        <p className="font-display mt-6 max-w-[20ch] text-3xl italic leading-[1.05] text-[#f4ede0] md:text-5xl">
          Eight weeks later.
        </p>

        <motion.div
          style={{
            scale: numberScale,
            y: numberY,
            opacity: numberOpacity,
          }}
          className="mt-12"
        >
          <div
            className="font-display leading-[0.78] tracking-tight"
            style={{
              color: "#f55e09",
              fontSize: "clamp(10rem, 34vw, 34rem)",
              fontVariationSettings: '"opsz" 144',
            }}
          >
            {headlineNumber.value}
          </div>
        </motion.div>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <p className="font-serif-text md:col-span-5 text-2xl italic leading-[1.25] text-[#f4ede0]">
            Copilot adoption across the cohort. Industry norm sits closer to
            thirty.
          </p>
          <blockquote className="font-serif-text md:col-span-7 md:col-start-7 text-xl leading-[1.4] text-[#f4ede0]/85">
            <span className="text-[#f55e09]">&ldquo;</span>
            {caseStudy.quote}
            <span className="text-[#f55e09]">&rdquo;</span>
            <footer className="font-ui mt-4 text-[11px] uppercase not-italic tracking-[0.22em] text-[#f4ede0]/55">
              {caseStudy.attribution}
            </footer>
          </blockquote>
        </div>

        <div className="mt-16">
          <SessionVideo
            clip={media.roomScenes.result}
            variant="scene"
            className="rounded-sm"
            label="Eight weeks later"
          />
        </div>
      </div>
    </section>
  );
}

function SceneInvitation() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const lift = useTransform(scrollYProgress, [0, 1], [60, 0]);
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#f4ede0] py-32 text-[#0b0a08] md:py-44"
    >
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#0b0a08]/55">
          {roomScenes[4].eyebrow}
        </p>
        <motion.div style={{ y: lift }}>
          <h2
            className="font-display mt-6 leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 10vw, 11rem)" }}
          >
            <span className="block">Come and</span>
            <span className="block italic text-[#f55e09]">sit in.</span>
          </h2>
        </motion.div>

        <p className="font-serif-text mt-10 max-w-[44ch] text-2xl italic leading-[1.25] text-[#0b0a08]/85">
          We run cohorts continuously. The next session has space, and the one
          after will not.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <a
            href={`mailto:${company.email}?subject=Booking%20an%20Illuminate%20session`}
            className="inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-8 py-4 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
          >
            Book a session
            <span aria-hidden>→</span>
          </a>
          <a
            href={`mailto:${company.email}`}
            className="font-serif-text text-2xl italic text-[#0b0a08] underline decoration-[#f55e09] decoration-2 underline-offset-4 hover:text-[#f55e09]"
          >
            {company.email}
          </a>
        </div>

        <div className="mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t border-[#0b0a08]/15 pt-8 text-[11px] uppercase tracking-[0.22em] text-[#0b0a08]/55">
          <span className="font-display text-xl not-italic tracking-tight text-[#0b0a08]">
            Illuminate Learning
          </span>
          <span>Pembrokeshire</span>
          <Link href="/session" className="hover:text-[#f55e09]">
            Conventional version: /session
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- shared scene primitives ---------- */

function Scene({
  eyebrow,
  kicker,
  children,
  dark = false,
}: {
  eyebrow: string;
  kicker?: string;
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

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-32 md:py-44 ${
        dark ? "bg-black" : "bg-[#0a0907]"
      } text-[#f4ede0]`}
    >
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-[1500px] px-6 md:px-10"
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
        <div className="mt-10">{children}</div>
      </motion.div>
    </section>
  );
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
      ? "clamp(4rem, 12vw, 12rem)"
      : size === "lg"
        ? "clamp(3rem, 9vw, 8rem)"
        : "clamp(2.5rem, 7vw, 6.5rem)";
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
      className={`font-serif-text max-w-[48ch] text-xl italic leading-[1.35] text-[#f4ede0]/85 md:text-2xl ${className}`}
    >
      {children}
    </p>
  );
}
