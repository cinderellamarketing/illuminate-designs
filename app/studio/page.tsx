"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { clients, pillars, approachPoints, team, stat, caseStudy } from "@/lib/copy";
import { useIsTouch } from "@/lib/useIsTouch";

/* ───── Global blend-mode cursor ───── */
function StudioCursor() {
  const isTouch = useIsTouch();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 380, damping: 32, mass: 0.4 });
  const y = useSpring(0, { stiffness: 380, damping: 32, mass: 0.4 });
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setGrown(!!t?.closest("a, button, [data-magnetic]"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [isTouch, x, y]);

  if (isTouch) return null;
  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60] rounded-full bg-brand-orange"
      style={{
        x,
        y,
        width: grown ? 60 : 18,
        height: grown ? 60 : 18,
        marginLeft: grown ? -30 : -9,
        marginTop: grown ? -30 : -9,
        mixBlendMode: "difference",
        transition: "width 220ms ease, height 220ms ease, margin 220ms ease",
      }}
    />
  );
}

/* ───── Magnetic CTA ───── */
function Magnetic({
  children,
  className,
  href,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      x.set(dx * 0.18);
      y.set(dy * 0.18);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      data-magnetic
      className={className}
      style={{ x, y }}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </motion.a>
  );
}

/* ───── Hero cursor-tracked spotlight ───── */
function HeroSpotlight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - r.left}px`);
      el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [isTouch]);
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(700px circle at var(--sx, 30%) var(--sy, 30%), rgba(245,94,9,0.16), transparent 60%), #f4ede0",
      }}
    >
      {children}
    </div>
  );
}

/* ───── Count-up ───── */
function CountUp({
  to,
  duration = 1500,
  suffix,
}: {
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

/* ───── Spotlight wordmark — bigger, more present, footer ───── */
function StudioSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch) return;
    let raf = 0;
    let t = 0;
    let hovering = false;
    const tick = () => {
      if (!hovering) {
        t += 0.005;
        const x = 50 + Math.sin(t) * 28;
        const y = 50 + Math.cos(t * 0.6) * 22;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onMove = (e: MouseEvent) => {
      hovering = true;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const onLeave = () => {
      hovering = false;
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
        className="text-[20vw] leading-[0.85] tracking-[-0.04em] text-paper-studio/10"
        style={{
          fontFamily: "var(--font-bricolage)",
          fontVariationSettings: '"wdth" 100, "opsz" 96',
          fontWeight: 800,
        }}
      >
        Illuminate
      </div>
      <div
        aria-hidden
        className="absolute inset-0 text-[20vw] leading-[0.85] tracking-[-0.04em] text-brand-orange"
        style={{
          fontFamily: "var(--font-bricolage)",
          fontVariationSettings: '"wdth" 100, "opsz" 96',
          fontWeight: 800,
          WebkitMaskImage:
            "radial-gradient(circle 300px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.7) 40%, transparent 80%)",
          maskImage:
            "radial-gradient(circle 300px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.7) 40%, transparent 80%)",
        }}
      >
        Illuminate
      </div>
      <span className="sr-only">Illuminate</span>
    </div>
  );
}

/* ───── Helpers ───── */
const monoLabel =
  "text-[11px] uppercase tracking-[0.22em] [font-family:var(--font-plex-mono)]";

function SectionLabel({
  num,
  children,
  inverted,
}: {
  num: string;
  children: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={monoLabel} style={{ opacity: 0.55 }}>
        {num}
      </span>
      <span
        className={monoLabel}
        style={{ color: inverted ? "#f4ede0" : "#0c0a08" }}
      >
        {children}
      </span>
    </div>
  );
}

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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function StudioPage() {
  return (
    <main
      className="bg-paper-studio text-obsidian-studio min-h-dvh"
      style={{
        fontFamily: "var(--font-bricolage)",
        cursor: "none",
      }}
    >
      <StudioCursor />

      {/* Header */}
      <header className="relative z-20 px-6 md:px-10 pt-6 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className={`${monoLabel} text-obsidian-studio/70 hover:text-obsidian-studio`}
        >
          ← /index
        </Link>
        <nav className="hidden md:flex gap-8">
          <a href="#approach" className={monoLabel}>
            Approach
          </a>
          <a href="#work" className={monoLabel}>
            Case study
          </a>
          <a href="#team" className={monoLabel}>
            Team
          </a>
          <a href="#contact" className={`${monoLabel} text-brand-orange`}>
            Contact
          </a>
        </nav>
        <span className={`${monoLabel} text-obsidian-studio/70`}>
          /studio · 2026
        </span>
      </header>

      {/* 1. Hero — spotlight */}
      <HeroSpotlight>
        <section className="relative px-6 md:px-10 pt-16 md:pt-28 pb-24 md:pb-40">
          <Reveal>
            <SectionLabel num="01">Microsoft Copilot · Adoption</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-10 leading-[0.86] tracking-[-0.02em]">
              <span
                className="block text-[14vw] md:text-[10.5vw]"
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontVariationSettings: '"wdth" 120, "opsz" 96',
                  fontWeight: 700,
                }}
              >
                Training built
              </span>
              <span
                className="block text-[12vw] md:text-[9vw] -mt-2"
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontVariationSettings: '"wdth" 75, "opsz" 96',
                  fontWeight: 500,
                }}
              >
                for the way{" "}
                <em
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontStyle: "italic",
                    color: "#f55e09",
                    fontWeight: 400,
                  }}
                >
                  work
                </em>
              </span>
              <span
                className="block text-[14vw] md:text-[10.5vw] -mt-2"
                style={{
                  fontFamily: "var(--font-bricolage)",
                  fontVariationSettings: '"wdth" 100, "opsz" 96',
                  fontWeight: 800,
                }}
              >
                actually happens.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <p className="md:col-span-6 text-lg md:text-xl text-obsidian-studio/75 max-w-prose">
                Role-specific Copilot programmes for sales floors, service desks
                and senior teams. Built around the job, measured against the
                work, followed up for ninety days after the last classroom day.
              </p>
              <div className="md:col-span-6 flex items-center gap-6 md:justify-end">
                <Magnetic
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-obsidian-studio text-paper-studio px-7 py-4 text-sm uppercase tracking-[0.18em]"
                >
                  Book a discovery call →
                </Magnetic>
                <a
                  href="#approach"
                  className={`${monoLabel} underline underline-offset-4`}
                >
                  Read the approach
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </HeroSpotlight>

      {/* 2. Logo strip — marquee */}
      <section className="bg-paper-studio border-y border-obsidian-studio/15 py-7 overflow-hidden">
        <div
          className="flex items-center gap-14 marquee-track whitespace-nowrap"
          onMouseEnter={(e) =>
            (e.currentTarget.dataset.paused = "true")
          }
          onMouseLeave={(e) => (e.currentTarget.dataset.paused = "false")}
        >
          {[...clients, ...clients, ...clients].map((c, i) => (
            <span key={`${c}-${i}`} className="flex items-center gap-14">
              <span className="text-2xl md:text-3xl text-obsidian-studio/80" style={{ fontVariationSettings: '"wdth" 100', fontWeight: 500 }}>
                {c}
              </span>
              <span className="text-brand-orange text-2xl">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* 3. Problem + stat — obsidian */}
      <section className="bg-obsidian-studio text-paper-studio px-6 md:px-10 py-28 md:py-40">
        <SectionLabel num="02" inverted>
          The problem
        </SectionLabel>
        <Reveal>
          <h2 className="mt-10 leading-[0.92] tracking-[-0.015em] max-w-5xl">
            <span
              className="block text-5xl md:text-7xl"
              style={{ fontVariationSettings: '"wdth" 100', fontWeight: 700 }}
            >
              Every team has the tools.
            </span>
            <span
              className="block text-5xl md:text-7xl"
              style={{ fontVariationSettings: '"wdth" 85', fontWeight: 500 }}
            >
              <em
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  color: "#f55e09",
                  fontWeight: 400,
                }}
              >
                Far fewer
              </em>{" "}
              have the skills.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <p
                className="text-[28vw] md:text-[14vw] leading-[0.85] tracking-[-0.04em] text-brand-orange"
                style={{ fontVariationSettings: '"wdth" 100', fontWeight: 800 }}
              >
                {stat.hero}
              </p>
            </div>
            <div className="md:col-span-5 md:pl-8 md:border-l border-paper-studio/20">
              <p
                className="text-2xl md:text-3xl"
                style={{ fontVariationSettings: '"wdth" 100', fontWeight: 500 }}
              >
                {stat.heroLabel}.
              </p>
              <p
                className={`${monoLabel} mt-6 text-paper-studio/60`}
              >
                Source · {stat.source}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. Three pillars — cream */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <SectionLabel num="03">What we run</SectionLabel>
        <Reveal>
          <h2
            className="mt-8 text-4xl md:text-6xl max-w-4xl leading-[0.95] tracking-[-0.01em]"
            style={{ fontVariationSettings: '"wdth" 95', fontWeight: 600 }}
          >
            Three programmes, built around the{" "}
            <em
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                color: "#f55e09",
                fontWeight: 400,
              }}
            >
              role
            </em>{" "}
            rather than the tool.
          </h2>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {pillars.map((p, i) => (
            <Reveal key={p.number} delay={i * 0.12}>
              <article className="group rounded-md border border-obsidian-studio/15 p-7 transition-colors hover:border-brand-orange hover:bg-brand-orange/5">
                <div className="flex items-baseline justify-between">
                  <span
                    className="text-4xl"
                    style={{ fontVariationSettings: '"wdth" 100', fontWeight: 700 }}
                  >
                    {p.number}
                  </span>
                  <span className={`${monoLabel} text-obsidian-studio/55`}>
                    Programme
                  </span>
                </div>
                <h3
                  className="mt-6 text-3xl"
                  style={{ fontVariationSettings: '"wdth" 95', fontWeight: 600 }}
                >
                  {p.title}
                </h3>
                <p className="mt-4 text-base text-obsidian-studio/75">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Approach — obsidian, large numbered items */}
      <section id="approach" className="bg-obsidian-studio text-paper-studio">
        <div className="px-6 md:px-10 py-16">
          <SectionLabel num="04" inverted>
            How we work
          </SectionLabel>
          <Reveal>
            <h2
              className="mt-8 text-4xl md:text-6xl max-w-4xl leading-[0.95] tracking-[-0.01em]"
              style={{ fontVariationSettings: '"wdth" 95', fontWeight: 600 }}
            >
              We do not deliver courses.
              <br />
              We change{" "}
              <em
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  color: "#f55e09",
                  fontWeight: 400,
                }}
              >
                behaviour
              </em>
              .
            </h2>
          </Reveal>
        </div>
        <div>
          {approachPoints.map((a, i) => (
            <Reveal key={a.number} delay={i * 0.05}>
              <article className="px-6 md:px-10 min-h-[80vh] py-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-paper-studio/15">
                <div className="md:col-span-4">
                  <span
                    className="block text-[28vw] md:text-[12vw] leading-[0.9] tracking-[-0.04em] text-brand-orange"
                    style={{
                      fontVariationSettings: '"wdth" 100',
                      fontWeight: 800,
                    }}
                  >
                    {a.number}
                  </span>
                </div>
                <div className="md:col-span-7 md:col-start-6">
                  <h3
                    className="text-5xl md:text-7xl leading-[0.95] tracking-[-0.01em]"
                    style={{ fontVariationSettings: '"wdth" 90', fontWeight: 600 }}
                  >
                    {a.title}.
                  </h3>
                  <p className="mt-6 text-lg md:text-xl text-paper-studio/80 max-w-2xl">
                    {a.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Case study — cream with count-up */}
      <section id="work" className="px-6 md:px-10 py-28 md:py-40">
        <SectionLabel num="05">Case study · MSP channel partner</SectionLabel>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <Reveal className="md:col-span-7">
            <p
              className="text-[34vw] md:text-[18vw] leading-[0.82] tracking-[-0.04em] text-brand-orange"
              style={{ fontVariationSettings: '"wdth" 100', fontWeight: 800 }}
            >
              <CountUp to={caseStudy.number} suffix={caseStudy.suffix} />
            </p>
            <p
              className="mt-2 text-2xl md:text-3xl max-w-md"
              style={{ fontVariationSettings: '"wdth" 95', fontWeight: 500 }}
            >
              {caseStudy.label}.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-5 md:pl-8 md:border-l border-obsidian-studio/15">
            <blockquote
              className="text-xl md:text-2xl leading-[1.35]"
              style={{ fontVariationSettings: '"wdth" 100', fontWeight: 400 }}
            >
              <em
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  color: "#f55e09",
                }}
              >
                &ldquo;
              </em>
              {caseStudy.quote}
              <em
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                  color: "#f55e09",
                }}
              >
                &rdquo;
              </em>
            </blockquote>
            <p className={`${monoLabel} mt-6 text-obsidian-studio/65`}>
              {caseStudy.attribution}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 7. Team */}
      <section
        id="team"
        className="bg-obsidian-studio text-paper-studio px-6 md:px-10 py-24 md:py-32"
      >
        <SectionLabel num="06" inverted>
          The bench
        </SectionLabel>
        <Reveal>
          <h2
            className="mt-8 text-4xl md:text-6xl max-w-4xl leading-[0.95] tracking-[-0.01em]"
            style={{ fontVariationSettings: '"wdth" 95', fontWeight: 600 }}
          >
            A small team of{" "}
            <em
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                color: "#f55e09",
                fontWeight: 400,
              }}
            >
              practitioners
            </em>
            , not professional trainers.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <article className="rounded-md border border-paper-studio/15 p-5 h-full">
                <div className="aspect-square w-full rounded-sm bg-paper-studio/8 mb-4 grid place-items-center">
                  <span
                    className="text-5xl text-paper-studio/45"
                    style={{
                      fontFamily: "var(--font-instrument)",
                      fontStyle: "italic",
                    }}
                  >
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-xl" style={{ fontVariationSettings: '"wdth" 100', fontWeight: 600 }}>
                  {m.name}
                </h3>
                <p className={`${monoLabel} mt-1 text-paper-studio/55`}>
                  {m.role}
                </p>
                <p className="mt-3 text-sm text-paper-studio/75">{m.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8. Final CTA */}
      <section
        id="contact"
        className="px-6 md:px-10 py-28 md:py-40 grid grid-cols-1 md:grid-cols-12 gap-10 items-end"
      >
        <Reveal className="md:col-span-8">
          <SectionLabel num="07">Get in touch</SectionLabel>
          <h2
            className="mt-8 text-5xl md:text-[8.5vw] leading-[0.9] tracking-[-0.02em]"
            style={{ fontVariationSettings: '"wdth" 100', fontWeight: 700 }}
          >
            Let us talk about what your{" "}
            <em
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                color: "#f55e09",
                fontWeight: 400,
              }}
            >
              team
            </em>{" "}
            needs.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-4 md:pl-8 md:border-l border-obsidian-studio/15">
          <p className="text-base text-obsidian-studio/75 max-w-sm">
            Thirty minutes. No deck. We will ask what the work looks like and
            tell you whether a programme would help.
          </p>
          <Magnetic
            href="mailto:hello@illuminate.training"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange text-paper-studio px-6 py-3 text-sm uppercase tracking-[0.18em]"
          >
            hello@illuminate.training →
          </Magnetic>
        </Reveal>
      </section>

      {/* 9. Footer */}
      <footer className="bg-obsidian-studio text-paper-studio pt-16 pb-10">
        <div className="px-6 md:px-10">
          <StudioSpotlight />
        </div>
        <div className="px-6 md:px-10 mt-10 flex flex-wrap items-end justify-between gap-6">
          <div className={`${monoLabel} text-paper-studio/60 space-y-1`}>
            <p>Illuminate Learning · Manchester &amp; London</p>
            <p>Company no. 14582910 · Registered in England</p>
          </div>
          <div className={`${monoLabel} flex gap-6 text-paper-studio/80`}>
            <Link href="/">/index</Link>
            <Link href="/editorial">/editorial</Link>
            <Link href="/cinema">/cinema</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
