"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
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

// The page authors a deliberate rhythm rather than one uniform block per
// section. Bright, dense, working sections (lights on) alternate with dark,
// sparse, single-statement sections (lights off), each with its own shape:
// a full-bleed line, a role-lane track, a two-side comparison, a quiet
// partner band, a footage-led proof, a warm close. The 82% gauge appears
// once, in the hero.
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
// Lights on, full immersion. Footage behind, the headline, and the one
// place the 82% gauge lives on this page.

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

          {/* Stat gauge — the room's meter reading. The only 82% gauge on
              the page. */}
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
// Lights off. A quiet full-bleed moment: one strong line in a single pool
// of light, a lot of dark space around it. No kicker, almost wordless.

function Gap() {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-[84svh] items-center overflow-hidden bg-ground">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-15%", left: "-12%", width: "64%", height: "135%" }}
      />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-32 md:px-10 md:py-52">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display max-w-[16ch] leading-[0.9]"
          style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)" }}
        >
          A licence is <span className="hl-underline">not a skill.</span>
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-12 max-w-[30ch] text-base leading-[1.55] text-text-muted md:text-lg"
        >
          {sessionGap.pull}
        </motion.p>
      </div>
    </section>
  );
}

/* ---------------- What we do ---------------- */
// Lights on, the busy working section. A three-lane track, each lane built
// around a named role, so its silhouette differs from the text sections.

function WhatWeDo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const lit = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      id="what-we-do"
      className="relative overflow-hidden border-t border-hairline bg-surface py-24 md:py-32"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-[1400px] px-6 md:px-10 scene-lights ${
          lit ? "is-on" : ""
        }`}
      >
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="label">what we do</p>
            <h2
              className="font-display mt-5 leading-[0.96]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
            >
              We build each session around the role.
            </h2>
          </div>
          <p className="max-w-[46ch] self-end leading-[1.6] text-text/75 md:col-span-5">
            {sessionWhatWeDo.body}
          </p>
        </div>

        {/* Three role lanes on one rail. Hairline gaps read the panels as a
            single connected track rather than free-floating cards. */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:mt-20 md:grid-cols-3">
          {sessionWhatWeDo.cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: 0.08 + i * 0.12 }}
              className="group flex min-h-[280px] flex-col bg-surface p-8 transition-colors hover:bg-surface-2 md:min-h-[340px] md:p-10"
            >
              <div className="flex items-center justify-between border-b border-hairline pb-5">
                <span className="font-mono text-[12px] tracking-[0.06em] text-brand-amber">
                  0{i + 1}
                </span>
                <span className="font-mono text-[11px] tracking-[0.06em] text-text-muted">
                  {card.role}
                </span>
              </div>
              <h3 className="font-display mt-6 text-3xl leading-[1.02] md:text-[2.6rem]">
                {card.title.replace(/\.$/, "")}
              </h3>
              <p className="mt-auto max-w-[34ch] pt-6 leading-[1.55] text-text/70">
                {card.body}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-12">
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
// A real two-side comparison, since the copy is one. Copilot Premium, the
// paid licence, sits neutral; Copilot Basic, the included tier, is the
// highlighted quick win. Not a paragraph.

function QuickWin() {
  const reduce = useReducedMotion();
  const c = sessionQuickWin.compare;
  return (
    <section className="relative overflow-hidden bg-ground py-24 md:py-36">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "0%", right: "-12%", left: "auto", width: "52%", height: "120%" }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <h2
          className="font-display max-w-[22ch] leading-[0.98]"
          style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
        >
          They are already paying for the safe option.
        </h2>

        <p className="mt-12 font-mono text-[12px] tracking-[0.08em] text-brand-amber">
          {sessionQuickWin.intro}
        </p>

        <div className="mt-5 grid items-stretch gap-5 md:grid-cols-2">
          {/* Premium — the paid licence, held neutral. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col rounded-xl border border-hairline bg-surface p-8 md:p-10"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl md:text-[1.9rem]">
                {c.premium.name}
              </h3>
              <span className="font-mono text-[11px] tracking-[0.04em] text-text-muted">
                {c.premium.tag}
              </span>
            </div>
            <p className="mt-6 leading-[1.6] text-text/70">{c.premium.body}</p>
          </motion.div>

          {/* Basic — the included tier, the quick win. Lit. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex flex-col rounded-xl border border-brand-orange/45 bg-surface-2 p-8 md:p-10"
            style={{
              boxShadow:
                "0 0 0 1px rgba(245,94,9,0.12), 0 26px 64px -44px rgba(245,94,9,0.65)",
            }}
          >
            <span className="absolute right-6 top-6 rounded-full border border-brand-orange/40 px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-brand-amber">
              {c.basic.flag}
            </span>
            <h3 className="font-display text-2xl text-brand-orange md:text-[1.9rem]">
              {c.basic.name}
            </h3>
            <p className="mt-1 font-mono text-[11px] tracking-[0.04em] text-brand-amber">
              {c.basic.tag}
            </p>
            <p className="mt-5 leading-[1.6] text-text/80">{c.basic.body}</p>
          </motion.div>
        </div>

        <p className="mt-10 max-w-[62ch] leading-[1.6] text-text/70">
          {sessionQuickWin.kicker}
        </p>
      </div>
    </section>
  );
}

/* ---------------- For MSPs ---------------- */
// The partner angle. A confident, quieter band: tighter spacing, the
// warmest raised surface, a single horizontal row. Its own treatment.

function ForMsps() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-surface-2 py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid items-center gap-x-12 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8 }}
              className="font-display max-w-[18ch] leading-[1.0]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
            >
              You do not have to become the trainer.
            </motion.h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="max-w-[52ch] leading-[1.6] text-text/75">
              {sessionForMsps.body}
            </p>
            <Link
              href={sessionForMsps.cta.href}
              className="btn btn-secondary ignite mt-8"
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
// Visual-led. The footage carries it; very little text. The stat is woven
// into a line rather than a second gauge, and the sample-session link
// points into the immersive room.

function Proof() {
  const reduce = useReducedMotion();
  return (
    <section
      id="proof"
      className="relative overflow-hidden bg-ground py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9 }}
            className="md:col-span-8"
          >
            <SessionVideo
              clip={media.sessionHero}
              variant="scene"
              className="rounded-lg"
              showMuteToggle
              label="Inside a live session"
            />
          </motion.div>
          <div className="flex flex-col md:col-span-4">
            <SessionVideo
              clip={media.caseStudy}
              variant="portrait"
              className="rounded-lg"
              label="Interview, just out of frame"
            />
            <p className="mt-3 font-mono text-[12px] text-text-muted">
              {sessionProof.testimonialPlaceholder}
            </p>
          </div>
        </div>

        {/* Very little text: a short line, the woven figure, the sample
            link into the room. */}
        <div className="mt-12 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[30ch]">
            <h2
              className="font-display leading-[1.0]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              The difference is the delivery.
            </h2>
            <p className="mt-4 font-mono text-[13px] leading-[1.5] text-text-muted">
              {sessionProof.figureLine}
            </p>
          </div>
          <Link
            href={sessionProof.cta.href}
            className="btn btn-primary btn-lg ignite"
          >
            <span aria-hidden className="btn-switch" />
            {sessionProof.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Close ---------------- */
// The CTA. Simple and warm: a strong resting pool of light, one heading,
// the booking button, and the lights hint.

function Close() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-ground py-28 md:py-40">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-20%", left: "20%", width: "60%", height: "150%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 text-center md:px-10">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display mx-auto max-w-[18ch] leading-[0.96]"
          style={{ fontSize: "clamp(2.75rem, 7vw, 6.5rem)" }}
        >
          Let&apos;s turn those licences into something useful.
        </motion.h2>
        <p className="mx-auto mt-8 max-w-[44ch] text-lg leading-[1.6] text-text/75 md:text-xl">
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
