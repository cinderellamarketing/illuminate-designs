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
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scenes, toClip } from "./scenes";
import { company, nav, roomBeats, statTooltip } from "@/lib/copy";

const STAT = 82;

// /room is a standalone sample session. Its one job is to make the visitor
// feel sat in one of our training rooms. Footage leads; text stays minimal.
// Nine authored beats, their shapes varied by the lights-on / lights-off
// metaphor: the room comes up, dims for a quiet line, brightens for a
// training moment, and so on, to a fully lit close. Video is referenced,
// not stored — see app/room/scenes.ts. Every egg (light switch gate, nav
// bulb, Konami, maze) and the shared nav / footer carry over.
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

      <Enter />
      <RoomBefore />
      <TrainingOne />
      <ProofOne />
      <TrainingTwo />
      <TheNumber />
      <ProofTwo />
      <HowItSticks />
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

/* ---------------- Nav ---------------- */
// Full site nav, hidden during the opening beat so the room fills the
// frame, fading in once the visitor has scrolled in.

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

/* ---------------- Beat 1 · Enter ---------------- */
// Full-bleed footage, lights coming up, minimal chrome. One line and a
// scroll cue.

function Enter() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-black"
    >
      <SessionVideo
        clip={toClip(scenes.enter)}
        variant="hero"
        managed
        eager
        showMuteToggle
        className="h-full w-full"
        label="the session starting"
      />

      {/* Lights coming up: a dark veil lifts on entry. Skipped for reduced
          motion, which starts already lit. */}
      {!reduce && (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="pointer-events-none absolute inset-0 z-20 bg-[#050403]"
        />
      )}

      {/* Bottom scrim so the line stays legible over the still or footage. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,4,3,0) 40%, rgba(5,4,3,0.4) 72%, rgba(5,4,3,0.82) 100%)",
        }}
      />

      {/* Minimal chrome: a live indicator, mono. */}
      <div className="absolute left-6 top-6 z-30 flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-text/80 md:left-10 md:top-8">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-brand-amber"
          style={{ boxShadow: "0 0 8px rgba(249,167,29,0.8)" }}
        />
        Illuminate · session starting
      </div>

      {/* One line, low in frame. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-24 md:px-10 md:pb-28">
        <div className="mx-auto w-full max-w-[1500px]">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.9 }}
            className="font-display max-w-[18ch] leading-[1.0] text-text"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {roomBeats.enter.line}
          </motion.h1>
        </div>
      </div>

      {/* Scroll cue. */}
      <motion.div
        style={{ opacity: reduce ? 1 : cueOpacity }}
        className="absolute inset-x-0 bottom-7 z-30 flex justify-center font-mono text-[11px] tracking-[0.08em] text-text/70"
      >
        <span className="flex items-center gap-3">
          <span aria-hidden>↓</span>
          {roomBeats.enter.cue}
        </span>
      </motion.div>
    </section>
  );
}

/* ---------------- Beat 2 · The room before ---------------- */
// Lights low. Mostly dark, sparse, a single quiet still and one line.

function RoomBefore() {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden bg-ground">
      {/* A single quiet still, dimmed right down — the room before the
          lights. */}
      <div aria-hidden className="absolute inset-0">
        <img
          src={scenes.before.poster}
          alt=""
          className="h-full w-full object-cover opacity-[0.18]"
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(13,11,9,0.96) 0%, rgba(13,11,9,0.82) 45%, rgba(13,11,9,0.6) 100%)",
          }}
        />
      </div>
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-10%", left: "-14%", width: "62%", height: "130%" }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 py-28 md:px-10 md:py-44">
        <Kicker>Before</Kicker>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display mt-6 max-w-[20ch] leading-[1.02]"
          style={{ fontSize: "clamp(1.9rem, 4.6vw, 3.6rem)" }}
        >
          <span className="block">{roomBeats.before.lead}</span>
          <span className="block text-text-muted">{roomBeats.before.tail}</span>
        </motion.h2>
      </div>
    </section>
  );
}

/* ---------------- Beat 3 · Training one ---------------- */
// Lights on. A contained frame, footage leading, a caption slot beneath.

function TrainingOne() {
  const ref = useRef<HTMLDivElement | null>(null);
  const lightsOn = useSceneLights(ref);
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden border-t border-hairline bg-surface py-16 md:py-20">
      <div
        ref={ref}
        className={`mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <Kicker>In the room</Kicker>
        <div className="mt-7 md:mt-9">
          <SceneFrame>
            <SessionVideo
              clip={toClip(scenes.taskOnScreen)}
              variant="fill"
              managed
              className="h-full w-full"
              label="a task on screen"
            />
          </SceneFrame>
          <SlotCaption
            className="mx-auto max-w-[calc(52svh*16/9)]"
            text={scenes.taskOnScreen.caption}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beat 4 · Proof one ---------------- */
// Lights low. A single client line, lit in the dark. Labelled slot.

function ProofOne() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-ground">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-15%", left: "6%", width: "70%", height: "150%" }}
      />
      <div className="relative mx-auto w-full max-w-[1500px] px-6 py-28 md:px-10 md:py-40">
        <Kicker>From the room</Kicker>
        <ProofSlot
          className="mt-8 max-w-[24ch]"
          quote={roomBeats.proofOne.placeholder}
          note={roomBeats.proofOne.note}
        />
      </div>
    </section>
  );
}

/* ---------------- Beat 5 · Training two ---------------- */
// Lights on, reframed from beat three: footage one side, the line the
// other.

function TrainingTwo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const lightsOn = useSceneLights(ref);
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden border-t border-hairline bg-surface py-16 md:py-20">
      <div
        ref={ref}
        className={`mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <SceneFrame align="left">
              <SessionVideo
                clip={toClip(scenes.learnerReaction)}
                variant="fill"
                managed
                className="h-full w-full"
                label="a reaction in the room"
              />
            </SceneFrame>
          </div>
          <div className="md:col-span-5">
            <Kicker>The turn</Kicker>
            <p
              className="font-display mt-5 leading-[1.04]"
              style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.9rem)" }}
            >
              {scenes.learnerReaction.caption}
            </p>
            <SlotTag className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beat 6 · The number ---------------- */
// Its own quiet instrument beat. The 82-against-30 gauge, once on the page.

function TheNumber() {
  return (
    <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-ground py-24 text-center md:py-32">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "0%", left: "20%", width: "60%", height: "120%" }}
      />
      <div className="relative mx-auto w-full max-w-[760px] px-6 md:px-10">
        <Kicker className="justify-center">The number</Kicker>
        <div className="mt-10 flex justify-center">
          <StatMeter
            value={STAT}
            from={30}
            align="center"
            fontSize="min(22vw, 34svh)"
            meterMaxWidth="min(74vw, 420px)"
            tooltip={statTooltip}
          />
        </div>
        <p className="mx-auto mt-12 max-w-[36ch] font-mono text-[13.5px] leading-[1.7] tracking-[0.02em] text-text/80">
          {roomBeats.number.line}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Beat 7 · Proof two ---------------- */
// Lights low. A result or outsider's reaction, lit in the dark. Reframed
// from beat four: aligned to the other edge, with a thin rule.

function ProofTwo() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden border-t border-hairline bg-ground">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-15%", right: "4%", left: "auto", width: "68%", height: "150%" }}
      />
      <div className="relative mx-auto w-full max-w-[1500px] px-6 py-28 md:px-10 md:py-40">
        <div className="ml-auto max-w-[26ch] text-right">
          <Kicker className="justify-end">A result</Kicker>
          <ProofSlot
            className="mt-8"
            align="right"
            quote={roomBeats.proofTwo.placeholder}
            note={roomBeats.proofTwo.note}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beat 8 · How it sticks ---------------- */
// Lights on, visual-led, minimal text. The delivery and the follow-up.

function HowItSticks() {
  const ref = useRef<HTMLDivElement | null>(null);
  const lightsOn = useSceneLights(ref);
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-surface py-16 md:py-24">
      <div
        ref={ref}
        className={`mx-auto w-full max-w-[1500px] px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <Kicker>How it sticks</Kicker>
        <div className="mt-7 md:mt-9">
          <div
            className="relative mx-auto overflow-hidden rounded-lg"
            style={{ aspectRatio: "16 / 9", width: "100%", maxWidth: "min(100%, calc(64svh * 16 / 9))" }}
          >
            <SessionVideo
              clip={toClip(scenes.followUp)}
              variant="fill"
              managed
              className="h-full w-full"
              label="small-group delivery and follow-up"
            />
          </div>
          <SlotCaption
            className="mx-auto max-w-[min(100%,calc(64svh*16/9))]"
            text={scenes.followUp.caption}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beat 9 · Close ---------------- */
// Lights up fully. One line, one primary CTA. Nav and footer carry the
// visitor on into the rest of the site, so this standalone page is not a
// dead end.

function Close() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-surface-2 py-28 md:py-40">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-20%", left: "16%", width: "68%", height: "150%" }}
      />
      <div className="relative mx-auto w-full max-w-[1500px] px-6 md:px-10">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display max-w-[16ch] leading-[0.98]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}
        >
          <span className="block">{roomBeats.close.line}</span>
          <span className="block text-brand-orange">{roomBeats.close.tail}</span>
        </motion.h2>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href={roomBeats.close.cta.href}
            className="btn btn-primary btn-lg ignite"
          >
            <span aria-hidden className="btn-switch" />
            {roomBeats.close.cta.label}
          </Link>
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

/* ---------------- Shared primitives ---------------- */

// Toggle a section from dim to lit when it scrolls into view. Reduced
// motion neutralises the brightness step in CSS, so this stays inert there.
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

function Kicker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-brand-amber ${className}`}
    >
      <span
        aria-hidden
        className="inline-block h-1 w-1 rounded-full bg-brand-amber"
      />
      {children}
    </span>
  );
}

// A contained 16/9 frame so scene footage never escapes the beat. Centred
// by default; align left when it shares a row with text.
function SceneFrame({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${
        align === "center" ? "mx-auto" : ""
      }`}
      style={{
        aspectRatio: "16 / 9",
        width: "100%",
        maxWidth: "calc(52svh * 16 / 9)",
      }}
    >
      {children}
    </div>
  );
}

// Small "slot" chip, marking a placeholder waiting on footage.
function SlotTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em] text-text-muted ${className}`}
    >
      <span className="rounded border border-hairline px-1.5 py-0.5 text-brand-amber">
        slot
      </span>
      caption to follow with footage
    </span>
  );
}

// A caption slot beneath a scene frame: the intended example line, plainly
// marked as a placeholder until footage is chosen.
function SlotCaption({
  text,
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <p
      className={`mt-4 flex flex-wrap items-center gap-3 font-mono text-[12.5px] leading-[1.5] tracking-[0.02em] text-text-muted ${className}`}
    >
      <span className="rounded border border-hairline px-1.5 py-0.5 text-[10.5px] tracking-[0.1em] text-brand-amber">
        slot
      </span>
      <span>{text?.trim() ? text : "caption to follow with footage"}</span>
    </p>
  );
}

// A proof beat: a client line lit in the dark, held as a labelled slot so
// nothing is invented until a real quote is cleared.
function ProofSlot({
  quote,
  note,
  align = "left",
  className = "",
}: {
  quote: string;
  note: string;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        className="font-display leading-[1.08] text-text/90"
        style={{ fontSize: "clamp(1.6rem, 3.6vw, 3rem)" }}
      >
        {quote}
      </p>
      <p
        className={`mt-6 font-mono text-[12px] leading-[1.6] text-text-muted ${
          align === "right" ? "ml-auto" : ""
        }`}
      >
        {note}
      </p>
    </div>
  );
}
