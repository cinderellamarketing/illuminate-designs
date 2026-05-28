"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SessionVideo } from "@/app/_components/SessionVideo";
import { LightMaze } from "@/app/_components/LightMaze";
import { LightSwitchGate } from "@/app/_components/LightSwitchGate";
import { KonamiFlourish } from "@/app/_components/KonamiFlourish";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { useDeclareVariant } from "@/app/_components/useVariant";
import { useLightEggs } from "@/app/_components/useLightEggs";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { media } from "@/lib/media";
import {
  headlineNumber,
  microcopy,
  sessionClose,
  sessionForMsps,
  sessionGap,
  sessionHero,
  sessionProof,
  sessionQuickWin,
  sessionWhatWeDo,
  statTooltip,
} from "@/lib/copy";

export function SessionPage() {
  useDeclareVariant("session");
  const { mazeOpen, closeMaze, handleBulb, bulbBlown, flourishing } =
    useLightEggs();

  return (
    <main className="font-ui bg-paper text-ink min-h-dvh">
      <SiteNav onBulb={handleBulb} bulbBlown={bulbBlown} />
      <Hero />
      <Gap />
      <WhatWeDo />
      <QuickWin />
      <ForMsps />
      <Proof />
      <Close />
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

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
      <SessionVideo
        clip={media.sessionHero}
        variant="hero"
        eager
        showMuteToggle
        className="h-full w-full"
      />

      {/* Overlay content. The wrapper is non-interactive so the unmute
          control on the underlying video stays clickable; only the
          actual CTAs opt back in. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-6 pb-14 md:px-10 md:pb-20">
        <div className="max-w-[1400px] mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="text-[11px] uppercase tracking-[0.22em] text-white/80"
          >
            <span
              aria-hidden
              className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[#f9a71d] align-middle"
            />
            {sessionHero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
            className="font-display mt-8 max-w-[20ch] leading-[0.92] tracking-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            Every team has the tools.{" "}
            <em className="text-[#f9a71d] not-italic">
              Far fewer have the skills.
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-serif-text mt-6 max-w-[58ch] text-xl italic leading-[1.35] text-white/85 md:text-2xl"
          >
            {sessionHero.sub}
          </motion.p>

          {/* Stat row — big count-up on the left, caption flanking it. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-end gap-x-8 gap-y-3"
          >
            <span
              className="font-display pointer-events-auto block leading-[0.78] tracking-tight"
              style={{
                fontSize: "clamp(5rem, 16vw, 14rem)",
                fontVariationSettings: '"opsz" 144',
                color: "#f55e09",
              }}
              title={statTooltip}
            >
              <HeroNumber />
            </span>
            <p className="font-serif-text mb-3 max-w-[32ch] text-base italic leading-[1.35] text-white/85 md:text-lg">
              {sessionHero.statCaption}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="pointer-events-auto mt-10 flex flex-wrap items-center gap-5"
          >
            <Link
              href={sessionHero.primaryCta.href}
              className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
            >
              {sessionHero.primaryCta.label}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href={sessionHero.secondaryCta.href}
              className="ignite-text text-[12px] uppercase tracking-[0.22em] text-white/85 underline-offset-4 hover:text-white hover:underline"
            >
              {sessionHero.secondaryCta.label}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- The gap ---------------- */

function Gap() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section className="relative bg-paper" ref={ref}>
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
          The gap
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1 }}
          className="font-display mt-6 max-w-[18ch] leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
        >
          A licence is{" "}
          <em className="italic text-[#f55e09]">not a skill.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-12 max-w-[58ch] text-lg leading-[1.55] text-ink/75"
        >
          {sessionGap.body}
        </motion.p>
      </div>
    </section>
  );
}

/* ---------------- What we do ---------------- */

function WhatWeDo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      id="what-we-do"
      className="relative bg-ink py-28 text-paper md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-paper/55">
              What we do
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9 }}
              className="font-display mt-6 leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
            >
              We train the role,{" "}
              <em className="text-[#f9a71d] not-italic">
                not the feature list.
              </em>
            </motion.h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-6">
            <p className="font-serif-text max-w-[48ch] text-xl italic leading-[1.4] text-paper/85">
              {sessionWhatWeDo.body}
            </p>
          </div>
        </div>

        {/* Three short cards rendered as an editorial stagger, not an
            equal row. Each card is wider than the next, set on a
            staircase to keep the rhythm of a long sentence. */}
        <div className="mt-20 grid gap-6 md:grid-cols-12">
          {sessionWhatWeDo.cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
              className={`ignite group rounded-sm border-t border-[#f4ede0]/15 pt-8 ${
                i === 0
                  ? "md:col-span-7 md:col-start-1"
                  : i === 1
                    ? "md:col-span-6 md:col-start-4"
                    : "md:col-span-5 md:col-start-8"
              }`}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
                  0{i + 1}
                </span>
                <h3 className="font-display text-3xl tracking-tight md:text-4xl">
                  {card.title}
                </h3>
              </div>
              <p className="mt-4 max-w-[44ch] text-base leading-[1.55] text-paper/80">
                {card.body}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-16">
          <Link
            href={sessionWhatWeDo.link.href}
            className="ignite-text font-ui inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-[#f9a71d] hover:text-[#f55e09]"
          >
            {sessionWhatWeDo.link.label}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Quick win ---------------- */

function QuickWin() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section ref={ref} className="relative bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
              The quick win most people miss
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9 }}
              className="font-display mt-6 leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              They are already paying for{" "}
              <em className="italic text-[#f55e09]">the safe option.</em>
            </motion.h2>
          </div>
          <div className="md:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-serif-text max-w-[60ch] text-xl italic leading-[1.45] text-ink/80 md:text-2xl"
            >
              {sessionQuickWin.body}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- For MSPs ---------------- */

function ForMsps() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink py-28 text-paper md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-paper/55">
          For MSPs
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9 }}
          className="font-display mt-6 max-w-[22ch] leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
        >
          You do not have to{" "}
          <em className="italic text-[#f9a71d]">become the trainer.</em>
        </motion.h2>

        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <p className="font-serif-text md:col-span-7 max-w-[60ch] text-xl italic leading-[1.4] text-paper/85 md:text-2xl">
            {sessionForMsps.body}
          </p>
          <div className="md:col-span-4 md:col-start-9 md:pt-2">
            <Link
              href={sessionForMsps.cta.href}
              className="ignite inline-flex items-center gap-3 rounded-full border border-[#f9a71d]/60 bg-transparent px-6 py-3.5 text-[13px] uppercase tracking-[0.18em] text-[#f9a71d] transition hover:border-[#f55e09] hover:bg-[#f55e09] hover:text-white"
            >
              {sessionForMsps.cta.label}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Proof ---------------- */

function Proof() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      id="proof"
      ref={ref}
      className="relative overflow-hidden bg-paper py-28 md:py-40"
    >
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-12 md:gap-12 md:px-10">
        <div className="md:col-span-5">
          <SessionVideo
            clip={media.caseStudy}
            variant="portrait"
            className="rounded-sm"
            label="Interview, just out of frame"
          />
          <p className="font-ui mt-4 text-[11px] uppercase tracking-[0.22em] text-ink/55">
            {sessionProof.testimonialPlaceholder}
          </p>
        </div>

        <div className="md:col-span-7 md:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9 }}
          >
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
              Proof
            </p>

            <h2
              className="font-display mt-6 leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
            >
              The difference is{" "}
              <em className="italic text-[#f55e09]">the delivery.</em>
            </h2>

            <p className="font-serif-text mt-8 max-w-[48ch] text-xl italic leading-[1.4] text-ink/80 md:text-2xl">
              {sessionProof.body}
            </p>

            <div
              className="font-display mt-12 leading-[0.92]"
              style={{
                fontSize: "clamp(4rem, 11vw, 11rem)",
                color: "#f55e09",
                fontVariationSettings: '"opsz" 144',
              }}
              title={statTooltip}
            >
              {headlineNumber.value}
            </div>
            <p className="font-serif-text mt-2 max-w-[40ch] text-lg italic leading-[1.35] text-ink/75">
              {sessionProof.pullFigure}
            </p>

            <div className="mt-12">
              <Link
                href={sessionProof.cta.href}
                className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
              >
                {sessionProof.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Close ---------------- */

function Close() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-paper py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
          Close
        </p>
        <motion.h2
          style={{ y }}
          className="font-display mt-6 max-w-[18ch] leading-[0.92] tracking-tight"
        >
          <span
            className="block text-ink"
            style={{ fontSize: "clamp(2.75rem, 7vw, 7rem)" }}
          >
            Let's turn those licences
          </span>
          <span
            className="block italic text-[#f55e09]"
            style={{ fontSize: "clamp(2.75rem, 7vw, 7rem)" }}
          >
            into something useful.
          </span>
        </motion.h2>
        <p className="font-serif-text mt-10 max-w-[48ch] text-2xl italic leading-[1.3] text-ink/80">
          {sessionClose.body}
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Link
            href={sessionClose.primaryCta.href}
            className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
          >
            {sessionClose.primaryCta.label}
            <span aria-hidden>→</span>
          </Link>
          <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
            {microcopy.lightsHintKeyboard}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Helpers ---------------- */

// Counts from the industry baseline (30) up to the headline number on
// mount. Reduced motion goes straight to the final value.
function HeroNumber() {
  const reduce = useReducedMotion();
  const finalValue = parseInt(headlineNumber.value, 10) || 82;
  const [count, setCount] = useState(30);

  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    const duration = 1500;
    const begin = 30;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(begin + (finalValue - begin) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, finalValue]);

  const display = reduce ? finalValue : count;

  return (
    <span aria-label={`${finalValue} per cent`}>
      {display}
      <span>%</span>
    </span>
  );
}
