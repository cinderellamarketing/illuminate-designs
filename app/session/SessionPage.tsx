"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { SessionVideo } from "@/app/_components/SessionVideo";
import { StatMeter } from "@/app/_components/StatMeter";
import { LightMaze } from "@/app/_components/LightMaze";
import { LightSwitchGate } from "@/app/_components/LightSwitchGate";
import { KonamiFlourish } from "@/app/_components/KonamiFlourish";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { useDeclareVariant } from "@/app/_components/useVariant";
import { useLightEggs } from "@/app/_components/useLightEggs";
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

const STAT = parseInt(headlineNumber.value, 10) || 82;

export function SessionPage() {
  useDeclareVariant("session");
  const { mazeOpen, closeMaze, handleBulb, bulbBlown, flourishing } =
    useLightEggs();

  return (
    <main className="font-sans min-h-dvh bg-ground text-text">
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
    <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-black">
      <SessionVideo
        clip={media.sessionHero}
        variant="hero"
        eager
        showMuteToggle
        className="h-full w-full"
      />

      {/* Overlay content. The wrapper is non-interactive so the unmute
          control on the underlying video stays clickable; only the actual
          CTAs and the stat opt back in. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-6 pb-14 md:px-10 md:pb-20">
        <div className="mx-auto grid w-full max-w-[1400px] gap-x-10 gap-y-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-mono text-[11px] tracking-[0.06em] text-text/75"
            >
              {sessionHero.eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
              className="font-display mt-6 max-w-[16ch] leading-[0.94] text-text"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.6rem)" }}
            >
              Every team has the tools.{" "}
              <span className="text-brand-orange">
                Far fewer have the skills.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-6 max-w-[52ch] text-lg leading-[1.5] text-text/85 md:text-xl"
            >
              {sessionHero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href={sessionHero.primaryCta.href}
                className="btn btn-primary btn-lg ignite"
              >
                <span aria-hidden className="btn-switch" />
                {sessionHero.primaryCta.label}
              </Link>
              <Link
                href={sessionHero.secondaryCta.href}
                className="btn btn-secondary btn-lg ignite"
              >
                {sessionHero.secondaryCta.label}
              </Link>
            </motion.div>
          </div>

          {/* Stat gauge — the room's meter reading. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="pointer-events-auto md:col-span-4 md:col-start-9"
          >
            <StatMeter
              value={STAT}
              label="copilot adoption"
              caption={sessionHero.statCaption}
              tooltip={statTooltip}
              fontSize="clamp(4.5rem, 10vw, 8.5rem)"
              meterMaxWidth="360px"
            />
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
    <section className="relative overflow-hidden bg-ground" ref={ref}>
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-10%", left: "-6%", width: "55%", height: "120%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="label">the gap</p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1 }}
              className="font-display mt-6 max-w-[14ch] leading-[0.92]"
              style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
            >
              A licence is{" "}
              <span className="hl-underline">not a skill.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="md:col-span-4 md:col-start-9 md:self-end"
          >
            <p className="max-w-[46ch] text-lg leading-[1.6] text-text/75">
              {sessionGap.body}
            </p>
          </motion.div>
        </div>
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
      className="relative overflow-hidden border-t border-hairline bg-surface py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label">what we do</p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9 }}
              className="font-display mt-6 leading-[0.96]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
            >
              We build each session around the role.
            </motion.h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:pt-10">
            <p className="max-w-[48ch] text-lg leading-[1.6] text-text/75">
              {sessionWhatWeDo.body}
            </p>
          </div>
        </div>

        {/* Three cards on a staircase, each holding its own space. */}
        <div className="mt-20 grid gap-6 md:grid-cols-12">
          {sessionWhatWeDo.cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
              className={`ignite group rounded-lg border border-hairline bg-ground/40 p-8 ${
                i === 0
                  ? "md:col-span-7 md:col-start-1"
                  : i === 1
                    ? "md:col-span-6 md:col-start-4"
                    : "md:col-span-5 md:col-start-8"
              }`}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[12px] text-brand-amber">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                  {card.title}
                </h3>
              </div>
              <p className="mt-4 max-w-[44ch] leading-[1.6] text-text/75">
                {card.body}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-16">
          <Link
            href={sessionWhatWeDo.link.href}
            className="ignite-text inline-flex items-center gap-3 font-mono text-[13px] text-brand-amber hover:text-brand-orange"
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
    <section
      ref={ref}
      className="relative overflow-hidden bg-ground py-28 md:py-40"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "0%", right: "-8%", left: "auto", width: "50%", height: "110%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label">the quick win most people miss</p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9 }}
              className="font-display mt-6 leading-[0.96]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              They are already paying for the safe option.
            </motion.h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:pt-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="max-w-[56ch] text-lg leading-[1.6] text-text/75"
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
      className="relative overflow-hidden border-t border-hairline bg-surface py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="label">for MSPs</p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9 }}
          className="font-display mt-6 max-w-[20ch] leading-[0.96]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
        >
          You do not have to become the trainer.
        </motion.h2>

        <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-12">
          <p className="md:col-span-7 max-w-[58ch] text-lg leading-[1.6] text-text/80 md:text-xl">
            {sessionForMsps.body}
          </p>
          <div className="md:col-span-4 md:col-start-9 md:pt-2">
            <Link
              href={sessionForMsps.cta.href}
              className="btn btn-secondary ignite"
            >
              {sessionForMsps.cta.label}
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
      className="relative overflow-hidden bg-ground py-28 md:py-40"
    >
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-12 md:gap-12 md:px-10">
        <div className="md:col-span-5">
          <SessionVideo
            clip={media.caseStudy}
            variant="portrait"
            className="rounded-lg"
            label="Interview, just out of frame"
          />
          <p className="mt-4 font-mono text-[12px] text-text-muted">
            {sessionProof.testimonialPlaceholder}
          </p>
        </div>

        <div className="md:col-span-7 md:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9 }}
          >
            <p className="label">proof</p>

            <h2
              className="font-display mt-6 leading-[0.96]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
            >
              The difference is the delivery.
            </h2>

            <p className="mt-8 max-w-[48ch] text-lg leading-[1.6] text-text/80 md:text-xl">
              {sessionProof.body}
            </p>

            <div className="mt-12">
              <StatMeter
                value={STAT}
                label="copilot adoption"
                caption={sessionProof.pullFigure}
                tooltip={statTooltip}
                fontSize="clamp(4rem, 9vw, 8rem)"
                meterMaxWidth="400px"
              />
            </div>

            <div className="mt-12">
              <Link
                href={sessionProof.cta.href}
                className="btn btn-primary btn-lg ignite"
              >
                <span aria-hidden className="btn-switch" />
                {sessionProof.cta.label}
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
      className="relative overflow-hidden border-t border-hairline bg-ground py-28 md:py-40"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-20%", left: "20%", width: "60%", height: "140%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 text-center md:px-10">
        <p className="label">close</p>
        <motion.h2
          style={{ y }}
          className="font-display mx-auto mt-6 max-w-[16ch] leading-[0.94]"
        >
          <span
            className="block"
            style={{ fontSize: "clamp(2.75rem, 7vw, 7rem)" }}
          >
            Let&apos;s turn those licences
          </span>
          <span
            className="block"
            style={{ fontSize: "clamp(2.75rem, 7vw, 7rem)" }}
          >
            into something useful.
          </span>
        </motion.h2>
        <p className="mx-auto mt-10 max-w-[46ch] text-lg leading-[1.6] text-text/75 md:text-xl">
          {sessionClose.body}
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Link
            href={sessionClose.primaryCta.href}
            className="btn btn-primary btn-lg ignite"
          >
            <span aria-hidden className="btn-switch" />
            {sessionClose.primaryCta.label}
          </Link>
          <span className="font-mono text-[12px] text-text-muted">
            {microcopy.lightsHintKeyboard}
          </span>
        </div>
      </div>
    </section>
  );
}
