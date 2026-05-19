"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  clients,
  pillars,
  approachPoints,
  team,
  stat,
  caseStudy,
  contact,
} from "@/lib/copy";
import { useIsTouch } from "@/lib/useIsTouch";

/* ───── Footer spotlight wordmark — lazy loop idle, follows cursor on hover ───── */
function EditorialSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const hoveringRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      if (!hoveringRef.current) {
        t += 0.0035;
        const x = 50 + Math.sin(t) * 22;
        const y = 50 + Math.cos(t * 0.78) * 18;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onMove = (e: MouseEvent) => {
      hoveringRef.current = true;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const onLeave = () => {
      hoveringRef.current = false;
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [isTouch]);

  return (
    <div
      ref={ref}
      className="relative w-full select-none"
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="text-[18vw] leading-[0.85] tracking-[-0.02em] text-ink-editorial/[0.08]"
        style={fraunceItalic}
      >
        Illuminate
      </div>
      <div
        aria-hidden
        className="absolute inset-0 text-[18vw] leading-[0.85] tracking-[-0.02em] text-brand-orange"
        style={{
          ...fraunceItalic,
          WebkitMaskImage:
            "radial-gradient(circle 220px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.6) 45%, transparent 80%)",
          maskImage:
            "radial-gradient(circle 220px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.6) 45%, transparent 80%)",
          transition: "all 600ms cubic-bezier(.22,.61,.36,1)",
        }}
      >
        Illuminate
      </div>
      <span className="sr-only">Illuminate</span>
    </div>
  );
}

/* ───── Reveal: quiet fade and rise ───── */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ───── Eyebrow: short rule + italic Public Sans ───── */
function Eyebrow({
  children,
  inverted,
}: {
  children: React.ReactNode;
  inverted?: boolean;
}) {
  const color = inverted ? "rgba(246,239,226,0.7)" : "rgba(21,17,13,0.6)";
  return (
    <p
      className="inline-flex items-center gap-3 text-[15px] italic"
      style={{ color, fontFamily: "var(--font-public-sans)" }}
    >
      <span
        aria-hidden
        className="inline-block h-px w-8"
        style={{ background: color }}
      />
      {children}
    </p>
  );
}

/* ───── Type styles ───── */
const fraunceDisplay = {
  fontFamily: "var(--font-fraunces)",
  fontVariationSettings: '"opsz" 144, "SOFT" 60',
} as const;

const fraunceItalic: React.CSSProperties = {
  fontFamily: "var(--font-fraunces)",
  fontStyle: "italic",
  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
};

const fraunceRoman: React.CSSProperties = {
  fontFamily: "var(--font-fraunces)",
  fontVariationSettings: '"opsz" 144, "SOFT" 50',
};

const h1Clamp = "clamp(48px, 8.5vw, 132px)";
const h2Clamp = "clamp(38px, 6vw, 92px)";
const statClamp = "clamp(120px, 22vw, 360px)";

export default function EditorialPage() {
  return (
    <main
      className="paper-grain bg-paper-editorial text-ink-editorial min-h-dvh"
      style={{ fontFamily: "var(--font-public-sans)" }}
    >
      {/* Masthead */}
      <header className="px-6 md:px-12 pt-10 pb-6 flex items-baseline justify-between border-b border-ink-editorial/15">
        <Link
          href="/"
          className="italic text-[14px] text-ink-editorial/65 hover:text-ink-editorial transition-colors"
        >
          ← All directions
        </Link>
        <div
          className="text-3xl tracking-[-0.01em]"
          style={fraunceItalic}
        >
          Illuminate
        </div>
        <nav className="hidden md:flex gap-7 text-[14px] italic text-ink-editorial/70">
          <a href="#approach">Approach</a>
          <a href="#work">Case study</a>
          <a href="#team">Team</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* 1. Hero — asymmetric 7/5 */}
      <section className="px-6 md:px-12 pt-14 md:pt-24 pb-28 md:pb-40 grid grid-cols-12 gap-6 md:gap-12 items-end">
        <Reveal className="col-span-12 md:col-span-7">
          <Eyebrow>Issue 01 · Microsoft Copilot · Adoption that lasts</Eyebrow>
          <h1
            className="mt-10 leading-[0.86] tracking-[-0.022em]"
            style={{ ...fraunceDisplay, fontSize: h1Clamp }}
          >
            Training built for the way{" "}
            <em
              style={{ ...fraunceItalic, color: "#f55e09" }}
            >
              work
            </em>{" "}
            actually happens.
          </h1>
          <p className="mt-10 max-w-[52ch] text-xl leading-[1.45] text-ink-editorial/80">
            We build Microsoft Copilot programmes for sales floors, service
            desks and senior teams. Every cohort is rebuilt around the job,
            measured against the work, and followed up at thirty, sixty and
            ninety days.
          </p>
          <div className="mt-10 flex items-baseline gap-8">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink-editorial text-paper-editorial px-7 py-3.5 text-[13px] tracking-[0.04em]"
            >
              Book a discovery call
              <span aria-hidden>→</span>
            </a>
            <a
              href="#approach"
              className="italic text-[15px] text-ink-editorial/70 underline underline-offset-[6px] decoration-ink-editorial/30"
            >
              Read the approach
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="col-span-12 md:col-span-5">
          <figure className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-ink-editorial">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 70% 30%, rgba(245,94,9,0.55) 0%, rgba(21,17,13,0.92) 60%, #15110d 100%)",
              }}
            />
            <figcaption className="absolute inset-0 flex items-end justify-between p-6 text-paper-editorial">
              <div>
                <p className="text-[11px] italic opacity-80">Field film · 02:14</p>
                <p className="mt-1 text-lg" style={fraunceItalic}>
                  Inside a working pilot
                </p>
              </div>
              <button
                aria-label="Play the film"
                className="grid h-14 w-14 place-items-center rounded-full bg-paper-editorial text-ink-editorial transition-transform hover:scale-[1.04]"
              >
                <svg
                  width="13"
                  height="15"
                  viewBox="0 0 12 14"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M0 0v14l12-7L0 0z" />
                </svg>
              </button>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* 2. Logo strip — refined, no marquee */}
      <section className="border-y border-ink-editorial/15 px-6 md:px-12 py-9">
        <div className="grid grid-cols-12 items-baseline gap-6">
          <p
            className="col-span-12 md:col-span-3 italic text-[14px] text-ink-editorial/60"
          >
            <span
              aria-hidden
              className="mr-3 inline-block h-px w-6 align-middle bg-ink-editorial/40"
            />
            Trusted on the floor at
          </p>
          <ul className="col-span-12 md:col-span-9 flex flex-wrap gap-x-10 gap-y-3">
            {clients.map((c) => (
              <li
                key={c}
                className="text-lg md:text-xl text-ink-editorial/85"
                style={fraunceRoman}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Problem + stat — magazine pull-quote */}
      <section className="px-6 md:px-12 py-28 md:py-40 grid grid-cols-12 gap-6 md:gap-12">
        <Reveal className="col-span-12 md:col-span-6">
          <Eyebrow>Why this matters</Eyebrow>
          <h2
            className="mt-10 leading-[0.96] tracking-[-0.012em]"
            style={{ ...fraunceDisplay, fontSize: h2Clamp }}
          >
            Every team has the tools.{" "}
            <em style={fraunceItalic}>Far fewer</em> have the skills.
          </h2>
          <p className="mt-10 max-w-[42ch] text-lg leading-[1.55] text-ink-editorial/75">
            The licence is the easy bit. Most rollouts hand staff a button and a
            prompt library, then expect behaviour to follow. It rarely does.
            The teams that get it right rebuild the work itself.
          </p>
        </Reveal>

        <Reveal
          delay={0.15}
          className="col-span-12 md:col-span-6 md:pl-10 md:border-l border-ink-editorial/15"
        >
          <p
            className="text-brand-orange leading-[0.78] tracking-[-0.05em]"
            style={{ ...fraunceItalic, fontSize: statClamp }}
          >
            {stat.hero}
          </p>
          <p
            className="mt-8 max-w-[28ch] text-2xl md:text-3xl leading-[1.15]"
            style={fraunceRoman}
          >
            {stat.heroLabel}.
          </p>
          <p
            className="mt-8 italic text-[13px] text-ink-editorial/55 max-w-md"
          >
            Source · {stat.source}
          </p>
        </Reveal>
      </section>

      {/* 4. Three pillars — thin-rule cards */}
      <section className="px-6 md:px-12 py-24 md:py-32 border-t border-ink-editorial/15">
        <div className="grid grid-cols-12 gap-6 md:gap-12 mb-16">
          <Reveal className="col-span-12 md:col-span-4">
            <Eyebrow>What we run</Eyebrow>
          </Reveal>
          <Reveal className="col-span-12 md:col-span-8">
            <h2
              className="leading-[0.96] tracking-[-0.01em] max-w-[18ch]"
              style={{ ...fraunceDisplay, fontSize: h2Clamp }}
            >
              Three programmes, built around the{" "}
              <em style={fraunceItalic}>role</em> rather than the tool.
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {pillars.map((p, i) => (
            <Reveal key={p.number} delay={i * 0.1}>
              <article className="relative">
                <span
                  aria-hidden
                  className="block h-px w-full bg-ink-editorial"
                />
                <div className="pt-6">
                  <p className="italic text-[14px] text-ink-editorial/55">
                    Programme {p.number}
                  </p>
                  <h3
                    className="mt-3 text-3xl md:text-4xl leading-[1.05]"
                    style={fraunceDisplay}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-5 text-[15.5px] leading-[1.6] text-ink-editorial/80 max-w-[34ch]">
                    {p.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Approach — single obsidian band */}
      <section
        id="approach"
        className="bg-ink-editorial text-paper-editorial px-6 md:px-12 py-28 md:py-40"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-12">
          <Reveal className="col-span-12 md:col-span-5">
            <Eyebrow inverted>How we work</Eyebrow>
            <h2
              className="mt-10 leading-[0.96] tracking-[-0.012em]"
              style={{ ...fraunceDisplay, fontSize: h2Clamp }}
            >
              We do not deliver courses.
              <br />
              We change <em style={fraunceItalic}>behaviour</em>.
            </h2>
          </Reveal>
          <div className="col-span-12 md:col-span-7 grid gap-12">
            {approachPoints.map((a, i) => (
              <Reveal key={a.number} delay={i * 0.1}>
                <article className="grid grid-cols-[auto_1fr] gap-8 items-baseline">
                  <span
                    className="text-3xl md:text-4xl text-brand-orange"
                    style={fraunceItalic}
                  >
                    {a.number}
                  </span>
                  <div>
                    <h3
                      className="text-2xl md:text-3xl leading-[1.1]"
                      style={fraunceDisplay}
                    >
                      {a.title}
                    </h3>
                    <p className="mt-3 max-w-[48ch] text-[15.5px] leading-[1.6] text-paper-editorial/75">
                      {a.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Case study — full-bleed orange band */}
      <section
        id="work"
        className="bg-brand-orange text-paper-editorial px-6 md:px-12 py-28 md:py-44"
      >
        <Reveal>
          <Eyebrow inverted>Case study · MSP channel partner</Eyebrow>
        </Reveal>
        <div className="mt-12 grid grid-cols-12 gap-6 md:gap-12 items-end">
          <Reveal className="col-span-12 md:col-span-6">
            <p
              className="leading-[0.8] tracking-[-0.05em]"
              style={{ ...fraunceItalic, fontSize: statClamp }}
            >
              {caseStudy.number}
              {caseStudy.suffix}
            </p>
            <p
              className="mt-6 max-w-[24ch] text-2xl md:text-3xl"
              style={fraunceRoman}
            >
              {caseStudy.label}.
            </p>
          </Reveal>
          <Reveal
            delay={0.15}
            className="col-span-12 md:col-span-6 md:pl-12 md:border-l border-paper-editorial/30"
          >
            <blockquote
              className="text-2xl md:text-[34px] leading-[1.2]"
              style={fraunceDisplay}
            >
              <span style={{ ...fraunceItalic, opacity: 0.85 }}>&ldquo;</span>
              {caseStudy.quote}
              <span style={{ ...fraunceItalic, opacity: 0.85 }}>&rdquo;</span>
            </blockquote>
            <p className="mt-8 italic text-[14px] text-paper-editorial/80">
              {caseStudy.attribution}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 7. Team */}
      <section
        id="team"
        className="px-6 md:px-12 py-28 md:py-40 border-t border-ink-editorial/15"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-12 mb-16">
          <Reveal className="col-span-12 md:col-span-4">
            <Eyebrow>The bench</Eyebrow>
          </Reveal>
          <Reveal className="col-span-12 md:col-span-8">
            <h2
              className="leading-[0.96] tracking-[-0.01em] max-w-[20ch]"
              style={{ ...fraunceDisplay, fontSize: h2Clamp }}
            >
              A small bench of{" "}
              <em style={fraunceItalic}>practitioners</em>, not professional
              trainers.
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <article>
                <span
                  aria-hidden
                  className="block h-px w-full bg-ink-editorial"
                />
                <div className="aspect-[4/5] w-full bg-ink-editorial/[0.06] grid place-items-center my-5">
                  <span
                    className="text-6xl text-ink-editorial/35"
                    style={fraunceItalic}
                  >
                    {m.name === "TBC"
                      ? "?"
                      : m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                  </span>
                </div>
                <h3
                  className="text-2xl leading-[1.1]"
                  style={fraunceDisplay}
                >
                  {m.name}
                </h3>
                <p className="mt-1 italic text-[13.5px] text-ink-editorial/60">
                  {m.role}
                </p>
                <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-editorial/80">
                  {m.bio}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8. Final CTA — centred, restrained, single button */}
      <section
        id="contact"
        className="px-6 md:px-12 py-32 md:py-48 border-t border-ink-editorial/15"
      >
        <Reveal className="max-w-4xl mx-auto text-center">
          <Eyebrow>Get in touch</Eyebrow>
          <h2
            className="mt-10 leading-[0.94] tracking-[-0.018em]"
            style={{ ...fraunceDisplay, fontSize: h1Clamp }}
          >
            Let us talk about what your{" "}
            <em style={fraunceItalic}>team</em> needs.
          </h2>
          <p className="mt-10 mx-auto max-w-[52ch] text-lg leading-[1.55] text-ink-editorial/75">
            Thirty minutes. No deck, no pitch. We will ask what the work
            actually looks like, then tell you whether a programme would help.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink-editorial text-paper-editorial px-8 py-4 text-[13.5px] tracking-[0.04em]"
            >
              {contact.email}
              <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* 9. Footer with spotlight wordmark */}
      <footer className="bg-paper-editorial pt-20 pb-10 border-t border-ink-editorial/15">
        <div className="px-6 md:px-12">
          <EditorialSpotlight />
        </div>
        <div className="px-6 md:px-12 mt-10 flex flex-wrap items-end justify-between gap-6 italic text-[13px] text-ink-editorial/60">
          <div className="space-y-1">
            <p>Illuminate Learning · {contact.location}</p>
            <p>{contact.companyNote} · Registered in England</p>
          </div>
          <div className="flex gap-7 not-italic text-ink-editorial/75">
            <Link href="/">Index</Link>
            <Link href="/studio">/studio</Link>
            <Link href="/cinema">/cinema</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
