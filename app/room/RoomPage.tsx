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
import { useLightEggs } from "@/app/_components/useLightEggs";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scenes, toClip, type Scene } from "./scenes";
import { nav } from "@/lib/copy";

// /room is the standalone sample session. Its one job is to make the visitor
// feel sat in one of our live training rooms, with James delivering and
// social proof woven into the scroll.
//
// The footage is an honest artifact: each clip is the Microsoft 365 Copilot
// app on screen with a rail of participant camera tiles down the right. Every
// recording is framed cleanly on a raised charcoal surface with a warm light
// pool behind it, so it reads as a real session sitting in a lit room. It is
// never cropped, stretched or overlaid — the teaching in the app carries the
// beat (see RoomFrame, and SessionVideo `fit="contain"`).
//
// Ten authored beats (see app/room/scenes.ts) alternate lights-on working
// beats (the recordings) with lights-off quiet beats (a still, the two proof
// lines, the number), so the scroll feels authored. Framing and density vary
// between beats. Video is referenced, not stored. Every egg (light switch
// gate, nav bulb, Konami, maze) and the shared nav / footer carry over.
//
// NOTE: the Edd sales-enablement section is a separate, pending piece. Its
// placement is not yet decided and it is deliberately NOT built into /room.
export function RoomPage() {
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
        scrolled={navVisible}
        onBulb={handleBulb}
        bulbBlown={bulbBlown}
      />

      <Enter />
      <Gap />
      <Method />
      <ProofMcpin />
      <Task />
      <Security />
      <TheNumber />
      <Value />
      <ProofLymphoma />
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
// Persistent site nav: the wordmark and menu toggle stay visible from the
// very top of the page and throughout the scroll. Only the bar's background
// fades in once the visitor scrolls past the opening beat.

function EmergingNav({
  scrolled,
  onBulb,
  bulbBlown = false,
}: {
  scrolled: boolean;
  onBulb?: () => void;
  bulbBlown?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // A persistent, understated way out of the immersive scroll. The wordmark
  // (back to the homepage at "/") and the menu toggle stay visible from the
  // very top and throughout the scroll, both keyboard reachable with a visible
  // focus ring.
  // The bar is transparent over the opening footage and gains a blurred ground
  // once the visitor scrolls in, or whenever the menu is open.
  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid
          ? "border-b border-hairline bg-ground/85 backdrop-blur-md supports-[backdrop-filter]:bg-ground/70"
          : "border-b border-transparent bg-transparent"
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
            aria-label="Illuminate Learning, home"
            className="font-display ignite-text rounded-sm text-lg tracking-tight text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
          >
            Illuminate
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="room-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="ignite inline-flex h-10 items-center gap-2 rounded-md border border-hairline px-3.5 font-mono text-[12px] tracking-[0.04em] text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
        >
          <span aria-hidden className="text-base leading-none">
            {menuOpen ? "×" : "≡"}
          </span>
          Menu
        </button>
      </div>

      <div
        id="room-nav-menu"
        hidden={!menuOpen}
        className="border-t border-hairline bg-ground/95 backdrop-blur-md"
      >
        <nav className="mx-auto flex max-w-[1500px] flex-col gap-1 px-6 py-5 text-text md:px-10">
          {nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="ignite-text rounded-md py-2 font-mono text-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-amber"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={nav.primaryCta.href}
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary btn-sm ignite mt-3 self-start"
          >
            {nav.primaryCta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ---------------- Beat 1 · Enter ---------------- */
// Full-bleed framed recording, lights coming up. One line and a scroll cue
// beneath, on the ground, so nothing sits over the recording.

function Enter() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ground px-6 py-20 md:px-10"
    >
      <div className="relative z-10 flex w-full max-w-[1500px] flex-col items-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.5 }}
          className="flex w-full justify-center"
        >
          <RoomFrame
            scene={scenes.enter}
            label="the session starting"
            eager
            showMuteToggle
            maxWidth="calc(64svh * 16 / 9)"
          />
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: 0.8 }}
          className="font-display mt-8 max-w-[22ch] text-center leading-[1.04]"
          style={{ fontSize: "clamp(1.6rem, 3.6vw, 2.9rem)" }}
        >
          {scenes.enter.caption}
        </motion.h1>
      </div>

      {/* Lights coming up: a dark veil lifts on entry. Skipped for reduced
          motion, which starts already lit. */}
      {!reduce && (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="pointer-events-none absolute inset-0 z-30 bg-[#050403]"
        />
      )}

      {/* Scroll cue. */}
      <motion.div
        style={{ opacity: reduce ? 1 : cueOpacity }}
        className="absolute inset-x-0 bottom-7 z-20 flex justify-center font-mono text-[11px] tracking-[0.08em] text-text/65"
      >
        <span className="flex items-center gap-3">
          <span aria-hidden>↓</span>
          {scenes.enter.note}
        </span>
      </motion.div>
    </section>
  );
}

/* ---------------- Beat 2 · Gap ---------------- */
// Lights low. Mostly dark, sparse: a dimmed still and one two-part line.

function Gap() {
  const reduce = useReducedMotion();
  const [lead, tail] = splitTwo(scenes.gap.caption);
  return (
    <section className="relative flex min-h-[86svh] items-center overflow-hidden bg-ground">
      {/* A single quiet still, dimmed right down — the room before the
          lights come up. */}
      <div aria-hidden className="absolute inset-0">
        <img
          src={scenes.gap.poster}
          alt=""
          className="h-full w-full object-cover opacity-[0.14]"
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(13,11,9,0.97) 0%, rgba(13,11,9,0.86) 46%, rgba(13,11,9,0.64) 100%)",
          }}
        />
      </div>
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-8%", left: "-16%", width: "58%", height: "124%" }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 py-28 md:px-10 md:py-40">
        <Kicker>Before the lights</Kicker>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display mt-6 max-w-[18ch] leading-[1.04]"
          style={{ fontSize: "clamp(1.9rem, 4.6vw, 3.6rem)" }}
        >
          <span className="block">{lead}</span>
          {tail && <span className="block text-text-muted">{tail}</span>}
        </motion.h2>
      </div>
    </section>
  );
}

/* ---------------- Beat 3 · Method ---------------- */
// Lights on. Contained framed recording, centred, caption beneath.

function Method() {
  const ref = useRef<HTMLDivElement | null>(null);
  const lightsOn = useSceneLights(ref);
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-ground py-20 md:py-28">
      <div
        ref={ref}
        className={`mx-auto flex w-full max-w-[1500px] flex-col items-center px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <div className="mt-8 flex w-full justify-center">
          <RoomFrame
            scene={scenes.method}
            label="how the method is taught on screen"
            maxWidth="calc(55svh * 16 / 9)"
          />
        </div>
        <p
          className="font-display mt-8 max-w-[26ch] text-center leading-[1.18]"
          style={{ fontSize: "clamp(1.15rem, 2.3vw, 1.7rem)" }}
        >
          {scenes.method.caption}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Beat 4 · Proof one ---------------- */
// Lights low. A single client line, lit in the dark. Empty until a real
// quote is cleared — nothing invented.

function ProofMcpin() {
  return (
    <section className="relative flex min-h-[74svh] items-center overflow-hidden bg-ground">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-14%", left: "4%", width: "66%", height: "146%" }}
      />
      <div className="relative mx-auto w-full max-w-[1500px] px-6 py-28 md:px-10 md:py-40">
        <QuoteSlot className="mt-8 max-w-[24ch]" note={scenes.proofMcpin.note} />
      </div>
    </section>
  );
}

/* ---------------- Beat 5 · Task ---------------- */
// Lights on, reframed from the method beat: the line one side, the framed
// recording the other.

function Task() {
  const ref = useRef<HTMLDivElement | null>(null);
  const lightsOn = useSceneLights(ref);
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-ground py-20 md:py-28">
      <div
        ref={ref}
        className={`mx-auto grid w-full max-w-[1500px] items-center gap-10 px-6 md:grid-cols-12 md:gap-14 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <div className="md:col-span-5">
          <p
            className="font-display mt-5 leading-[1.06]"
            style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.9rem)" }}
          >
            {scenes.task.caption}
          </p>
        </div>
        <div className="flex justify-center md:col-span-7 md:justify-end">
          <RoomFrame
            scene={scenes.task}
            label="one real task, worked start to finish"
            maxWidth="calc(50svh * 16 / 9)"
            poolStyle={{
              top: "-16%",
              right: "-12%",
              left: "auto",
              width: "120%",
              height: "132%",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beat 6 · Security ---------------- */
// Lights on, mirrored from the task beat: framed recording one side, the
// line the other, so two working beats in a row read differently.

function Security() {
  const ref = useRef<HTMLDivElement | null>(null);
  const lightsOn = useSceneLights(ref);
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-ground py-20 md:py-28">
      <div
        ref={ref}
        className={`mx-auto grid w-full max-w-[1500px] items-center gap-10 px-6 md:grid-cols-12 md:gap-14 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <div className="flex justify-center md:order-1 md:col-span-7 md:justify-start">
          <RoomFrame
            scene={scenes.security}
            label="what the security shield protects"
            maxWidth="calc(50svh * 16 / 9)"
            poolStyle={{
              top: "-16%",
              left: "-12%",
              width: "120%",
              height: "132%",
            }}
          />
        </div>
        <div className="md:order-2 md:col-span-5">
          <p
            className="font-display mt-5 leading-[1.06]"
            style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.9rem)" }}
          >
            {scenes.security.caption}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beat 7 · The number ---------------- */
// Its own quiet beat, lights low. The stat is stated plainly as a caption,
// no gauge. The 82-against-30 gauge lives once, on the /session hero.

function TheNumber() {
  const reduce = useReducedMotion();
  const [lead, tail] = splitTwo(scenes.number.caption);
  return (
    <section className="relative flex min-h-[86svh] flex-col items-center justify-center overflow-hidden border-t border-hairline bg-ground py-24 text-center md:py-32">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "2%", left: "22%", width: "56%", height: "116%" }}
      />
      <div className="relative mx-auto w-full max-w-[820px] px-6 md:px-10">
        <Kicker className="justify-center">The result</Kicker>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display mt-10 leading-[1.08]"
          style={{ fontSize: "clamp(1.6rem, 3.6vw, 2.9rem)" }}
        >
          <span className="block">{lead}</span>
          {tail && <span className="block text-text-muted">{tail}</span>}
        </motion.p>
      </div>
    </section>
  );
}

/* ---------------- Beat 8 · Value ---------------- */
// Lights on. Centred framed recording, wider than the method beat, caption
// beneath.

function Value() {
  const ref = useRef<HTMLDivElement | null>(null);
  const lightsOn = useSceneLights(ref);
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-ground py-20 md:py-28">
      <div
        ref={ref}
        className={`mx-auto flex w-full max-w-[1500px] flex-col items-center px-6 md:px-10 scene-lights ${
          lightsOn ? "is-on" : ""
        }`}
      >
        <div className="mt-8 flex w-full justify-center">
          <RoomFrame
            scene={scenes.value}
            label="turning time saved into value"
            maxWidth="calc(60svh * 16 / 9)"
          />
        </div>
        <p
          className="font-display mt-8 max-w-[24ch] text-center leading-[1.12]"
          style={{ fontSize: "clamp(1.3rem, 2.6vw, 2rem)" }}
        >
          {scenes.value.caption}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Beat 9 · Proof two ---------------- */
// Lights low, mirrored from proof one: aligned to the other edge. Empty
// until a real quote is cleared.

function ProofLymphoma() {
  return (
    <section className="relative flex min-h-[74svh] items-center overflow-hidden border-t border-hairline bg-ground">
      <div
        aria-hidden
        className="light-pool"
        style={{
          top: "-14%",
          right: "4%",
          left: "auto",
          width: "64%",
          height: "146%",
        }}
      />
      <div className="relative mx-auto w-full max-w-[1500px] px-6 py-28 md:px-10 md:py-40">
        <div className="ml-auto max-w-[26ch] text-right">
          <QuoteSlot
            className="mt-8"
            align="right"
            note={scenes.proofLymphoma.note}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Beat 10 · Close ---------------- */
// Lights up fully. One line, one primary CTA. Nav and footer carry the
// visitor on into the rest of the site, so this standalone page is not a
// dead end.

function Close() {
  const reduce = useReducedMotion();
  const [lead, tail] = splitTwo(scenes.close.caption);
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-surface-2 py-28 md:py-40">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-22%", left: "18%", width: "66%", height: "150%" }}
      />
      <div className="relative mx-auto w-full max-w-[1500px] px-6 md:px-10">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display max-w-[16ch] leading-[1.0]"
          style={{ fontSize: "clamp(2.4rem, 6.4vw, 5.6rem)" }}
        >
          <span className="block">{lead}</span>
          {tail && <span className="block text-brand-orange">{tail}</span>}
        </motion.h2>

        {scenes.close.cta && (
          <div className="mt-10">
            <Link
              href={scenes.close.cta.href}
              className="btn btn-primary btn-lg ignite"
            >
              <span aria-hidden className="btn-switch" />
              {scenes.close.cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Shared primitives ---------------- */

// The signature framed recording: an honest screen recording contained on a
// raised charcoal surface, with a soft warm light pool behind, so it reads
// as a real session sitting in a lit room. `fit="contain"` keeps the app and
// its camera rail whole — never cropped or stretched. When a scene's source
// is empty the poster still paints and the page works today.
function RoomFrame({
  scene,
  label,
  eager = false,
  showMuteToggle = false,
  maxWidth,
  poolStyle,
  className = "",
}: {
  scene: Scene;
  label: string;
  eager?: boolean;
  showMuteToggle?: boolean;
  maxWidth?: string;
  poolStyle?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: "100%", maxWidth }}
    >
      <div
        aria-hidden
        className="light-pool"
        style={poolStyle ?? { top: "-18%", left: "-12%", width: "124%", height: "136%" }}
      />
      <figure className="relative m-0 rounded-2xl border border-hairline bg-surface-2 p-2 shadow-[0_50px_130px_-50px_rgba(0,0,0,0.95)] md:p-2.5">
        <div
          className="relative overflow-hidden rounded-xl bg-[#0b0a08]"
          style={{ aspectRatio: "16 / 9" }}
        >
          <SessionVideo
            clip={toClip(scene)}
            variant="fill"
            fit="contain"
            managed
            eager={eager}
            showMuteToggle={showMuteToggle}
            className="h-full w-full"
            label={label}
          />
        </div>
      </figure>
    </div>
  );
}

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

// A proof beat, lit in the dark: a client line held as a labelled slot so
// nothing is invented until a real quote is cleared. The bracketed marker
// follows the site convention for a pending, permissioned quote.
function QuoteSlot({
  note,
  align = "left",
  className = "",
}: {
  note?: string;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <figure className={`m-0 ${align === "right" ? "text-right" : ""} ${className}`}>
      <blockquote
        className="font-display leading-[1.1] text-text-muted"
        style={{ fontSize: "clamp(1.6rem, 3.6vw, 3rem)" }}
      >
        [Client line, with permission]
      </blockquote>
      {note && (
        <figcaption
          className={`mt-6 font-mono text-[11.5px] leading-[1.6] text-text-muted ${
            align === "right" ? "ml-auto" : ""
          }`}
        >
          {note}
        </figcaption>
      )}
    </figure>
  );
}

// Split a two-sentence caption into its two lines for display, keeping the
// words exactly as written. Falls back to the whole string when there is
// only one sentence.
function splitTwo(s: string): [string, string] {
  const i = s.indexOf(". ");
  if (i === -1) return [s, ""];
  return [s.slice(0, i + 1), s.slice(i + 2)];
}
