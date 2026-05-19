"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { clients, pillars, approachPoints, team, stat, caseStudy } from "@/lib/copy";
import { useIsTouch } from "@/lib/useIsTouch";

/* ───── Spotlight wordmark — quiet, footer-only ───── */
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
        // Slow lazy ellipse idle
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
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
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
      style={
        {
          "--mx": "50%",
          "--my": "50%",
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="text-[18vw] leading-[0.85] tracking-[-0.02em] text-ink-editorial/8"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontStyle: "italic",
          fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
        }}
      >
        Illuminate
      </div>
      <div
        aria-hidden
        className="absolute inset-0 text-[18vw] leading-[0.85] tracking-[-0.02em] text-brand-orange"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontStyle: "italic",
          fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
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

/* ───── Reveal — quiet fade and rise on section entry ───── */
function Reveal({
  children,
  delay = 0,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const MotionAs = motion[As as "div"];
  return (
    <MotionAs
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </MotionAs>
  );
}

const fraunces = {
  fontFamily: "var(--font-fraunces)",
  fontVariationSettings: '"opsz" 144, "SOFT" 70',
} as const;
const fraunceItalic = {
  fontFamily: "var(--font-fraunces)",
  fontStyle: "italic" as const,
  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
};

export default function EditorialPage() {
  return (
    <main
      className="paper-grain bg-paper-editorial text-ink-editorial min-h-dvh"
      style={{ fontFamily: "var(--font-public-sans)" }}
    >
      {/* Top bar */}
      <header className="relative z-10 px-6 md:px-12 pt-8 pb-6 flex items-baseline justify-between">
        <Link href="/" className="text-xs uppercase tracking-[0.22em] text-ink-editorial/60 hover:text-ink-editorial">
          ← All directions
        </Link>
        <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[0.22em] text-ink-editorial/70">
          <a href="#approach">Approach</a>
          <a href="#work">Case study</a>
          <a href="#team">Team</a>
          <a href="#contact" className="text-brand-orange">Get in touch</a>
        </nav>
        <span className="text-xs uppercase tracking-[0.22em] text-ink-editorial/60">
          Vol. 01 · /editorial
        </span>
      </header>

      {/* 1. Hero — asymmetric */}
      <section className="relative px-6 md:px-12 pt-10 md:pt-16 pb-24 md:pb-32 grid grid-cols-12 gap-6 md:gap-10 items-end">
        <Reveal className="col-span-12 md:col-span-8">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-editorial/60 mb-8">
            Issue 01 · Microsoft Copilot · Adoption that lasts
          </p>
          <h1
            className="text-[14vw] md:text-[10vw] leading-[0.86] tracking-[-0.02em]"
            style={fraunces}
          >
            Training built for the way <em style={{ ...fraunceItalic, color: "#f55e09" }}>work</em> actually happens.
          </h1>
        </Reveal>
        <Reveal delay={0.2} className="col-span-12 md:col-span-4">
          {/* Portrait video card */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-ink-editorial">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 70% 30%, rgba(245,94,9,0.55) 0%, rgba(21,17,13,0.9) 60%, #15110d 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-end justify-between p-5 text-paper-editorial">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] opacity-80">Field film · 02:14</p>
                <p className="mt-1 text-sm" style={fraunceItalic}>
                  Inside a working pilot
                </p>
              </div>
              <button
                aria-label="Play the film"
                className="grid h-12 w-12 place-items-center rounded-full bg-paper-editorial text-ink-editorial transition-transform hover:scale-105"
              >
                <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden>
                  <path d="M0 0v14l12-7L0 0z" />
                </svg>
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.35} className="col-span-12 md:col-span-7 md:col-start-1 mt-6">
          <p className="text-xl md:text-2xl leading-[1.35] text-ink-editorial/80 max-w-prose">
            We build Microsoft Copilot programmes for sales floors, service desks and senior teams. Every cohort is rebuilt around the job, measured against the work, and followed up at 30, 60 and 90 days.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink-editorial text-paper-editorial px-6 py-3 text-sm uppercase tracking-[0.18em]"
            >
              Book a discovery call
              <span aria-hidden>→</span>
            </a>
            <a href="#approach" className="text-sm uppercase tracking-[0.18em] underline underline-offset-4 text-ink-editorial/70">
              Read the approach
            </a>
          </div>
        </Reveal>
      </section>

      {/* 2. Logo strip — editorial: small caps, a quiet bar */}
      <section className="border-y border-ink-editorial/15 px-6 md:px-12 py-8">
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
          <span className="text-[10px] uppercase tracking-[0.28em] text-ink-editorial/60 mr-2">
            Trusted on the floor at
          </span>
          {clients.map((c) => (
            <span
              key={c}
              className="text-base md:text-lg text-ink-editorial/80"
              style={fraunceItalic}
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* 3. Problem + stat */}
      <section className="px-6 md:px-12 py-24 md:py-32 grid grid-cols-12 gap-6 md:gap-10">
        <Reveal className="col-span-12 md:col-span-6">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-editorial/60 mb-6">
            The problem
          </p>
          <h2 className="text-4xl md:text-6xl leading-[0.95] tracking-[-0.01em]" style={fraunces}>
            Every team has the tools. <em style={fraunceItalic}>Far fewer</em> have the skills.
          </h2>
          <p className="mt-6 max-w-prose text-lg text-ink-editorial/75">
            The licence is the easy bit. Most rollouts hand staff a button and a prompt library, then expect behaviour to follow. It rarely does. The teams that get it right rebuild the work itself.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="col-span-12 md:col-span-6 md:pl-10 md:border-l border-ink-editorial/15">
          <div
            className="text-[40vw] md:text-[22vw] leading-[0.78] tracking-[-0.04em] text-brand-orange"
            style={fraunceItalic}
          >
            {stat.hero}
          </div>
          <p className="mt-4 text-xl md:text-2xl max-w-md" style={fraunces}>
            {stat.heroLabel}.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-ink-editorial/55">
            Source · {stat.source}
          </p>
        </Reveal>
      </section>

      {/* 4. Three pillars */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-t border-ink-editorial/15">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-ink-editorial/60 mb-8">
            What we run
          </p>
          <h2 className="text-3xl md:text-5xl leading-[0.95] tracking-[-0.01em] max-w-3xl" style={fraunces}>
            Three programmes, built around the <em style={fraunceItalic}>role</em> rather than the tool.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {pillars.map((p, i) => (
            <Reveal key={p.number} delay={i * 0.12}>
              <div className="border-t border-ink-editorial/40 pt-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.22em] text-ink-editorial/55">
                    {p.number}
                  </span>
                  <span
                    className="text-2xl text-brand-orange"
                    style={fraunceItalic}
                  >
                    ✦
                  </span>
                </div>
                <h3 className="mt-3 text-2xl md:text-3xl" style={fraunces}>
                  {p.title}
                </h3>
                <p className="mt-3 text-base text-ink-editorial/75 max-w-sm">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Approach */}
      <section id="approach" className="px-6 md:px-12 py-24 md:py-32 grid grid-cols-12 gap-6 md:gap-10 border-t border-ink-editorial/15">
        <Reveal className="col-span-12 md:col-span-5">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-editorial/60 mb-6">
            How we work
          </p>
          <h2 className="text-4xl md:text-6xl leading-[0.95] tracking-[-0.01em]" style={fraunces}>
            We do not deliver courses. We change <em style={fraunceItalic}>behaviour</em>.
          </h2>
        </Reveal>
        <div className="col-span-12 md:col-span-7 grid gap-10">
          {approachPoints.map((a, i) => (
            <Reveal key={a.number} delay={i * 0.1}>
              <div className="grid grid-cols-[auto_1fr] gap-6 items-baseline">
                <span
                  className="text-3xl text-brand-orange"
                  style={fraunceItalic}
                >
                  {a.number}
                </span>
                <div>
                  <h3 className="text-2xl md:text-3xl" style={fraunces}>
                    {a.title}
                  </h3>
                  <p className="mt-2 text-base md:text-lg text-ink-editorial/75 max-w-prose">
                    {a.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Case study — full bleed orange band */}
      <section id="work" className="bg-brand-orange text-paper-editorial px-6 md:px-12 py-24 md:py-36">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-paper-editorial/80 mb-8">
            Case study · MSP channel partner
          </p>
        </Reveal>
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <Reveal className="col-span-12 md:col-span-6">
            <div
              className="text-[34vw] md:text-[16vw] leading-[0.82] tracking-[-0.03em]"
              style={fraunceItalic}
            >
              {caseStudy.number}
              {caseStudy.suffix}
            </div>
            <p className="mt-4 text-xl md:text-2xl max-w-sm" style={fraunces}>
              {caseStudy.label}.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="col-span-12 md:col-span-6 md:pl-10 md:border-l border-paper-editorial/30">
            <blockquote
              className="text-2xl md:text-3xl leading-[1.2] max-w-prose"
              style={fraunces}
            >
              <span style={{ ...fraunceItalic, opacity: 0.9 }}>“</span>
              {caseStudy.quote}
              <span style={{ ...fraunceItalic, opacity: 0.9 }}>”</span>
            </blockquote>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-paper-editorial/80">
              {caseStudy.attribution}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 7. Team */}
      <section id="team" className="px-6 md:px-12 py-24 md:py-32 border-t border-ink-editorial/15">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-ink-editorial/60 mb-6">
            The team
          </p>
          <h2 className="text-3xl md:text-5xl max-w-3xl leading-[0.95]" style={fraunces}>
            A small bench of <em style={fraunceItalic}>practitioners</em>, not professional trainers.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <div className="border-t border-ink-editorial/40 pt-4">
                <div className="aspect-[4/5] w-full bg-ink-editorial/8 mb-4 grid place-items-center">
                  <span
                    className="text-5xl text-ink-editorial/40"
                    style={fraunceItalic}
                  >
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-xl" style={fraunces}>
                  {m.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.18em] text-ink-editorial/60 mt-1">
                  {m.role}
                </p>
                <p className="mt-3 text-sm text-ink-editorial/75">{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8. Final CTA */}
      <section
        id="contact"
        className="px-6 md:px-12 py-28 md:py-40 border-t border-ink-editorial/15 grid grid-cols-12 gap-6 md:gap-10"
      >
        <Reveal className="col-span-12 md:col-span-8">
          <h2
            className="text-5xl md:text-8xl leading-[0.92] tracking-[-0.02em]"
            style={fraunces}
          >
            Let us talk about what your <em style={fraunceItalic}>team</em> needs.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="col-span-12 md:col-span-4 md:pl-8 md:border-l border-ink-editorial/15">
          <p className="text-base text-ink-editorial/75 max-w-sm">
            A thirty minute discovery call. No deck, no pitch. We will ask what the work actually looks like, then tell you whether a programme would help.
          </p>
          <a
            href="mailto:hello@illuminate.training"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-editorial text-paper-editorial px-6 py-3 text-sm uppercase tracking-[0.18em]"
          >
            hello@illuminate.training
            <span aria-hidden>→</span>
          </a>
        </Reveal>
      </section>

      {/* 9. Footer with spotlight wordmark */}
      <footer className="bg-paper-editorial pt-20 pb-10 border-t border-ink-editorial/15">
        <div className="px-6 md:px-12">
          <EditorialSpotlight />
        </div>
        <div className="px-6 md:px-12 mt-10 flex flex-wrap items-end justify-between gap-6 text-xs uppercase tracking-[0.22em] text-ink-editorial/60">
          <div className="space-y-1">
            <p>Illuminate Learning · Manchester &amp; London</p>
            <p>Company no. 14582910 · Registered in England</p>
          </div>
          <div className="flex gap-6">
            <Link href="/">Index</Link>
            <Link href="/studio">/studio</Link>
            <Link href="/cinema">/cinema</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
