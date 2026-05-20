"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { SessionVideo } from "@/app/_components/SessionVideo";
import { media } from "@/lib/media";
import {
  approachMoments,
  caseStudy,
  company,
  credibilityLine,
  headlineNumber,
  problemStatement,
  team,
} from "@/lib/copy";

export function SessionPage() {
  return (
    <main className="font-ui bg-paper text-ink min-h-dvh">
      <Nav />
      <Hero />
      <Credibility />
      <Problem />
      <Approach />
      <CaseStudy />
      <Team />
      <ClosingCTA />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <Link
          href="/"
          className="font-display text-2xl italic tracking-tight text-white mix-blend-difference"
        >
          Illuminate
        </Link>
        <nav className="hidden items-center gap-9 text-[12px] uppercase tracking-[0.18em] text-white mix-blend-difference md:flex">
          <a href="#approach">Approach</a>
          <a href="#case-study">Proof</a>
          <a href="#team">Team</a>
        </nav>
        <a
          href={`mailto:${company.email}?subject=Booking%20an%20Illuminate%20session`}
          className="font-ui inline-flex items-center gap-2 rounded-full bg-[#f55e09] px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
        >
          Book a session
        </a>
      </div>
    </header>
  );
}

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

      {/* Overlay content. The wrapper is non-interactive so the
          unmute control on the underlying video stays clickable;
          only the actual CTAs opt back in. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-6 pb-14 md:px-10 md:pb-20">
        <div className="max-w-[1400px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/80"
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#f9a71d]"
            />
            Live · Cohort in session
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
            className="font-display mt-6 flex items-baseline gap-6 text-white"
          >
            <span
              className="block leading-[0.78] tracking-tight"
              style={{
                fontSize: "clamp(8rem, 26vw, 24rem)",
                fontVariationSettings: '"opsz" 144',
                color: "#f55e09",
              }}
            >
              {headlineNumber.value}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="font-display mt-4 max-w-2xl text-2xl italic leading-[1.15] text-white md:text-3xl"
          >
            Copilot adoption in eight weeks. The industry norm sits closer to
            thirty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pointer-events-auto mt-10 flex flex-wrap items-center gap-5"
          >
            <a
              href={`mailto:${company.email}?subject=Booking%20an%20Illuminate%20session`}
              className="inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
            >
              Book a session
              <span aria-hidden>→</span>
            </a>
            <a
              href="#approach"
              className="text-[12px] uppercase tracking-[0.22em] text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              See the method
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Credibility() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  return (
    <section className="border-y border-ink/10 bg-paper" ref={ref}>
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 md:py-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8 }}
          className="font-display max-w-4xl text-2xl leading-[1.25] tracking-tight md:text-3xl"
        >
          <span className="text-ink/45">An aside.</span>{" "}
          <span className="text-ink">{credibilityLine}</span>{" "}
          <span className="text-ink/50">
            Working with Microsoft partners, MSPs and in-house enterprise teams
            from Pembrokeshire.
          </span>
        </motion.p>
      </div>
    </section>
  );
}

function Problem() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section className="relative bg-paper" ref={ref}>
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1 }}
          className="font-display leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)" }}
        >
          <span className="block text-ink">{problemStatement.big}</span>
          <span className="block italic text-[#f55e09]">
            {problemStatement.contrast}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-12 max-w-[52ch] text-lg leading-[1.55] text-ink/75"
        >
          {problemStatement.body}
        </motion.p>
      </div>
    </section>
  );
}

function Approach() {
  const reel = media.approachReel;
  return (
    <section id="approach" className="relative bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-paper/60">
              The method
            </p>
            <h2
              className="font-display mt-4 max-w-[20ch] leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
            >
              Role-specific. Measured.{" "}
              <em className="text-[#f9a71d]">It sticks.</em>
            </h2>
          </div>
          <p className="hidden max-w-[28ch] text-sm leading-[1.55] text-paper/65 md:block">
            We do not write generic decks. Every cohort sees its own workflow on
            screen, in the room. Scroll through a session.
          </p>
        </div>
      </div>

      {/* Horizontal scroll of session moments */}
      <div className="mt-14 overflow-x-auto pb-6 [scrollbar-width:thin]">
        <div className="flex gap-5 px-6 md:px-10">
          {reel.map((clip, i) => {
            const moment = approachMoments[i % approachMoments.length];
            return (
              <article
                key={clip.id}
                className="w-[78vw] shrink-0 sm:w-[460px] md:w-[520px]"
              >
                <SessionVideo
                  clip={clip}
                  variant="reel"
                  className="rounded-sm"
                />
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-paper/55">
                    0{i + 1}
                  </span>
                  <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
                    {moment.eyebrow}
                  </span>
                </div>
                <p className="font-serif-text mt-2 max-w-[36ch] text-lg leading-[1.4] text-paper">
                  {clip.caption}
                </p>
                <p className="mt-2 max-w-[36ch] text-sm leading-[1.55] text-paper/65">
                  {moment.body}
                </p>
              </article>
            );
          })}
          <div className="w-6 shrink-0 md:w-10" aria-hidden />
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      id="case-study"
      ref={ref}
      className="relative overflow-hidden bg-paper py-28 md:py-40"
    >
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-12 md:gap-12 md:px-10">
        <div className="md:col-span-5">
          <SessionVideo
            clip={media.caseStudy}
            variant="portrait"
            className="rounded-sm"
            label="Interview to follow"
          />
          <p className="font-ui mt-4 text-[11px] uppercase tracking-[0.22em] text-ink/55">
            {caseStudy.attribution}
          </p>
        </div>

        <div className="md:col-span-7 md:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9 }}
          >
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
              Case study · MSP channel partner
            </p>

            <div
              className="font-display mt-6 leading-[0.92]"
              style={{
                fontSize: "clamp(4rem, 11vw, 11rem)",
                color: "#f55e09",
                fontVariationSettings: '"opsz" 144',
              }}
            >
              {caseStudy.number}
            </div>

            <p className="font-serif-text mt-4 max-w-[40ch] text-2xl italic leading-[1.2] text-ink">
              {caseStudy.blurb}
            </p>

            <blockquote className="font-serif-text mt-12 max-w-[55ch] text-2xl leading-[1.35] text-ink/85">
              <span className="text-[#f55e09]">&ldquo;</span>
              {caseStudy.quote}
              <span className="text-[#f55e09]">&rdquo;</span>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Team() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section id="team" ref={ref} className="bg-ink py-28 text-paper md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-paper/55">
              The team in the room
            </p>
            <h2
              className="font-display mt-4 leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Three people will run your session.
            </h2>
            <p className="mt-6 max-w-[40ch] text-paper/70">
              Not contractors picked from a roster. The same faces every time,
              based in Pembrokeshire, working across the UK.
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="grid gap-6 sm:grid-cols-3">
              {team.map((person, i) => (
                <motion.article
                  key={person.name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                >
                  <SessionVideo
                    clip={media.team[i]}
                    variant="portrait"
                    className="rounded-sm"
                    label="Portrait to follow"
                  />
                  <div className="mt-4">
                    <h3 className="font-serif-text text-xl text-paper">
                      {person.name}
                    </h3>
                    <p className="font-ui mt-1 text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
                      {person.role}
                    </p>
                    <p className="mt-3 text-sm leading-[1.55] text-paper/70">
                      {person.bio}
                    </p>
                    <p className="font-serif-text mt-3 text-base italic text-paper/85">
                      {person.personality}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.h2
          style={{ y }}
          className="font-display leading-[0.92] tracking-tight"
        >
          <span
            className="block text-ink"
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
          >
            Sit in on a session.
          </span>
          <span
            className="block italic text-[#f55e09]"
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
          >
            See if it fits.
          </span>
        </motion.h2>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <a
            href={`mailto:${company.email}?subject=Booking%20an%20Illuminate%20session`}
            className="inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
          >
            Book a session
            <span aria-hidden>→</span>
          </a>
          <a
            href={`mailto:${company.email}`}
            className="font-serif-text text-2xl italic text-ink underline decoration-[#f55e09] decoration-2 underline-offset-4 hover:text-[#f55e09]"
          >
            {company.email}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-4 border-t border-ink/15 px-6 py-10 text-[11px] uppercase tracking-[0.22em] text-ink/55 md:px-10">
        <span className="font-display text-xl not-italic tracking-tight text-ink">
          Illuminate Learning
        </span>
        <span>Pembrokeshire · {company.email}</span>
        <span>
          <Link href="/room" className="text-ink/55 hover:text-[#f55e09]">
            Cinematic version: /room
          </Link>
        </span>
      </div>
    </footer>
  );
}
