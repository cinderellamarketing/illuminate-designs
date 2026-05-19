"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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

/* ───── Ambient cursor torch — atmosphere only, content readable underneath ───── */
function AmbientTorch() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 140, damping: 26, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 140, damping: 26, mass: 0.6 });

  const { scrollYProgress } = useScroll();
  const radius = useTransform(scrollYProgress, [0, 0.4, 1], [520, 640, 760]);
  const intensity = useTransform(scrollYProgress, [0, 0.4, 1], [0.13, 0.15, 0.12]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    rawX.set(window.innerWidth / 2);
    rawY.set(window.innerHeight / 2);
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    const onLeave = () => {
      rawX.set(window.innerWidth / 2);
      rawY.set(window.innerHeight / 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY]);

  const orangeGlow = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(245,94,9,${intensity}) 0%, rgba(245,94,9,0.04) 35%, transparent 65%)`;
  const creamGlow = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(245,240,232,0.08) 0%, transparent 60%)`;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: creamGlow, mixBlendMode: "screen" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: orangeGlow, mixBlendMode: "screen" }}
      />
    </>
  );
}

/* ───── Reveal: fade and rise on entry ───── */
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
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.85, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ───── Word-by-word rise on entry ───── */
function WordRise({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const words = text.split(" ");
  return (
    <div
      ref={ref}
      className={`flex flex-wrap gap-x-[0.28em] gap-y-2 ${className ?? ""}`}
      style={style}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 0.61, 0.36, 1],
            delay: i * 0.04,
          }}
        >
          {w}
        </motion.span>
      ))}
    </div>
  );
}

/* ───── Footer wordmark spotlight (the signature moment) ───── */
function CinemaWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const hoveringRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      if (!hoveringRef.current) {
        t += 0.0045;
        const x = 50 + Math.sin(t) * 30;
        const y = 50 + Math.cos(t * 0.7) * 22;
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
      className="relative w-full overflow-hidden select-none"
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      <motion.div
        initial={{ x: "8%", opacity: 0 }}
        animate={inView ? { x: "0%", opacity: 1 } : { x: "8%", opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative"
      >
        <h2
          aria-hidden
          className="text-[22vw] leading-[0.85] tracking-[-0.04em] whitespace-nowrap"
          style={{
            fontFamily: "var(--font-instrument)",
            fontStyle: "italic",
            color: "rgba(245,240,232,0.06)",
          }}
        >
          Illuminate
        </h2>
        <h2
          aria-hidden
          className="absolute inset-0 text-[22vw] leading-[0.85] tracking-[-0.04em] text-brand-orange whitespace-nowrap"
          style={{
            fontFamily: "var(--font-instrument)",
            fontStyle: "italic",
            WebkitMaskImage:
              "radial-gradient(circle 360px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,0,0,0.8) 45%, transparent 78%)",
            maskImage:
              "radial-gradient(circle 360px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,0,0,0.8) 45%, transparent 78%)",
            filter: "drop-shadow(0 0 24px rgba(245,94,9,0.45))",
          }}
        >
          Illuminate
        </h2>
        <span className="sr-only">Illuminate</span>
      </motion.div>
    </div>
  );
}

/* ───── Helpers ───── */
const mono = "[font-family:var(--font-plex-mono)]";
const monoLabel = `text-[10px] uppercase tracking-[0.28em] ${mono} text-cinema-warm/55`;

const display: React.CSSProperties = {
  fontFamily: "var(--font-instrument)",
  fontStyle: "italic",
};

const h1Clamp = "clamp(56px, 11vw, 200px)";
const h2Clamp = "clamp(40px, 7vw, 128px)";
const statClamp = "clamp(120px, 18vw, 320px)";

function SectionLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <p className={monoLabel}>
      {num} · {children}
    </p>
  );
}

export default function CinemaPage() {
  const isTouch = useIsTouch();

  return (
    <main
      className="relative bg-cinema-bg text-cinema-warm min-h-dvh overflow-x-hidden"
      style={{ fontFamily: "var(--font-plex-sans)" }}
    >
      {!isTouch && <AmbientTorch />}

      {/* All content sits above the ambient overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 md:px-10 pt-6 pb-4 flex items-center justify-between">
          <Link href="/" className={`${monoLabel} hover:text-cinema-warm`}>
            ← /index
          </Link>
          <nav className="hidden md:flex gap-8">
            <a href="#approach" className={monoLabel}>Approach</a>
            <a href="#work" className={monoLabel}>Case</a>
            <a href="#team" className={monoLabel}>Team</a>
            <a
              href="#contact"
              className={`text-[10px] uppercase tracking-[0.28em] ${mono} text-brand-orange`}
            >
              Contact
            </a>
          </nav>
          <span className={monoLabel}>/cinema</span>
        </header>

        {/* 1. Hero */}
        <section className="px-6 md:px-10 pt-20 md:pt-32 pb-28 md:pb-44">
          <Reveal>
            <SectionLabel num="01">Microsoft Copilot · Adoption that lasts</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="mt-10 leading-[0.9] tracking-[-0.025em]"
              style={{ ...display, fontSize: h1Clamp }}
            >
              <span className="block">Training built for</span>
              <span className="block">
                the way <span className="text-brand-orange">work</span> actually happens.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
              <p className="md:col-span-7 text-lg md:text-xl leading-[1.55] text-cinema-warm/85 max-w-[58ch]">
                Role-specific Copilot programmes for sales floors, service
                desks and senior teams. Built around the job, measured against
                the work, followed up for ninety days after the last classroom
                day.
              </p>
              <div className="md:col-span-5 md:text-right">
                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 rounded-full border border-cinema-warm/30 px-7 py-4 text-[11px] uppercase tracking-[0.22em] ${mono} hover:border-brand-orange hover:text-brand-orange transition-colors`}
                >
                  Book a discovery call →
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 2. Logo strip */}
        <section className="border-y border-cinema-warm/10 px-6 md:px-10 py-9">
          <div className="grid grid-cols-12 items-baseline gap-6">
            <p className={`col-span-12 md:col-span-3 ${monoLabel}`}>
              Trusted on the floor at
            </p>
            <ul className="col-span-12 md:col-span-9 flex flex-wrap gap-x-10 gap-y-3">
              {clients.map((c) => (
                <li
                  key={c}
                  className="text-lg md:text-xl text-cinema-warm/85"
                  style={display}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Problem + stat */}
        <section className="px-6 md:px-10 py-28 md:py-40">
          <Reveal>
            <SectionLabel num="02">The problem</SectionLabel>
          </Reveal>
          <WordRise
            text="Every team has the tools. Far fewer have the skills."
            className="mt-10 leading-[0.95] tracking-[-0.015em] max-w-[18ch]"
            style={{ ...display, fontSize: h2Clamp }}
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <Reveal className="md:col-span-7">
              <p
                className="text-brand-orange leading-[0.82] tracking-[-0.04em]"
                style={{ ...display, fontSize: statClamp }}
              >
                {stat.hero}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-5 md:pl-8 md:border-l border-cinema-warm/15">
              <p
                className="text-2xl md:text-3xl leading-[1.2] max-w-[28ch]"
                style={display}
              >
                {stat.heroLabel}.
              </p>
              <p className={`mt-8 ${monoLabel} max-w-md`}>
                Source · {stat.source}
              </p>
            </Reveal>
          </div>
        </section>

        {/* 4. Pillars */}
        <section className="px-6 md:px-10 py-28 md:py-40 border-t border-cinema-warm/10">
          <div className="grid grid-cols-12 gap-6 md:gap-12 mb-16">
            <Reveal className="col-span-12 md:col-span-4">
              <SectionLabel num="03">What we run</SectionLabel>
            </Reveal>
            <Reveal className="col-span-12 md:col-span-8">
              <h2
                className="leading-[0.96] tracking-[-0.01em] max-w-[20ch]"
                style={{ ...display, fontSize: h2Clamp }}
              >
                Three programmes, built around the role rather than the tool.
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {pillars.map((p, i) => (
              <Reveal key={p.number} delay={i * 0.1}>
                <article className="group relative">
                  <span aria-hidden className="block h-px w-full bg-cinema-warm/30" />
                  <div className="pt-6 flex items-start gap-4">
                    <span
                      aria-hidden
                      className="mt-3 inline-block h-2 w-2 rounded-full bg-brand-orange transition-shadow duration-300 group-hover:shadow-[0_0_22px_4px_rgba(245,94,9,0.55)]"
                    />
                    <div className="flex-1">
                      <p className={`${monoLabel}`}>Programme {p.number}</p>
                      <h3
                        className="mt-3 text-3xl md:text-4xl leading-[1.05]"
                        style={display}
                      >
                        {p.title}
                      </h3>
                      <p className="mt-5 text-[15.5px] leading-[1.65] text-cinema-warm/80 max-w-[34ch]">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 5. Approach */}
        <section id="approach" className="px-6 md:px-10 py-28 md:py-40 border-t border-cinema-warm/10">
          <Reveal>
            <SectionLabel num="04">How we work</SectionLabel>
          </Reveal>
          <WordRise
            text="We do not deliver courses. We change behaviour."
            className="mt-10 leading-[0.95] tracking-[-0.015em] max-w-[20ch]"
            style={{ ...display, fontSize: h2Clamp }}
          />
          <div className="mt-16 grid gap-10">
            {approachPoints.map((a, i) => (
              <Reveal key={a.number} delay={i * 0.06}>
                <article className="grid grid-cols-12 gap-6 items-baseline border-t border-cinema-warm/12 pt-10">
                  <div className="col-span-12 md:col-span-2">
                    <span
                      className="text-5xl md:text-7xl text-brand-orange"
                      style={display}
                    >
                      {a.number}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-10">
                    <h3
                      className="text-3xl md:text-5xl leading-[1.05]"
                      style={display}
                    >
                      {a.title}.
                    </h3>
                    <p className="mt-4 text-lg md:text-xl leading-[1.55] text-cinema-warm/85 max-w-[60ch]">
                      {a.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 6. Case study */}
        <section id="work" className="px-6 md:px-10 py-32 md:py-44 border-t border-cinema-warm/10">
          <Reveal>
            <SectionLabel num="05">Case study · MSP channel partner</SectionLabel>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <Reveal className="md:col-span-7">
              <p
                className="text-brand-orange leading-[0.82] tracking-[-0.04em]"
                style={{ ...display, fontSize: statClamp }}
              >
                {caseStudy.number}
                {caseStudy.suffix}
              </p>
              <p
                className="mt-4 text-2xl md:text-3xl max-w-[24ch]"
                style={display}
              >
                {caseStudy.label}.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-5 md:pl-8 md:border-l border-cinema-warm/15">
              <blockquote
                className="text-xl md:text-2xl leading-[1.4]"
                style={display}
              >
                &ldquo;{caseStudy.quote}&rdquo;
              </blockquote>
              <p className={`mt-6 ${monoLabel}`}>{caseStudy.attribution}</p>
            </Reveal>
          </div>
        </section>

        {/* 7. Team */}
        <section id="team" className="px-6 md:px-10 py-28 md:py-40 border-t border-cinema-warm/10">
          <div className="grid grid-cols-12 gap-6 md:gap-12 mb-16">
            <Reveal className="col-span-12 md:col-span-4">
              <SectionLabel num="06">The bench</SectionLabel>
            </Reveal>
            <Reveal className="col-span-12 md:col-span-8">
              <h2
                className="leading-[0.96] tracking-[-0.01em] max-w-[20ch]"
                style={{ ...display, fontSize: h2Clamp }}
              >
                A small team of practitioners, not professional trainers.
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <article>
                  <span aria-hidden className="block h-px w-full bg-cinema-warm/30" />
                  <div className="aspect-[4/5] w-full bg-cinema-warm/[0.05] grid place-items-center my-5">
                    <span
                      className="text-6xl text-cinema-warm/45"
                      style={display}
                    >
                      {m.name === "TBC"
                        ? "?"
                        : m.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </span>
                  </div>
                  <h3 className="text-2xl leading-[1.1]" style={display}>
                    {m.name}
                  </h3>
                  <p className={`mt-1 ${monoLabel}`}>{m.role}</p>
                  <p className="mt-4 text-[14.5px] leading-[1.6] text-cinema-warm/80">
                    {m.bio}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 8. Final CTA */}
        <section
          id="contact"
          className="px-6 md:px-10 py-32 md:py-48 border-t border-cinema-warm/10"
        >
          <Reveal>
            <SectionLabel num="07">Get in touch</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              className="mt-10 leading-[0.94] tracking-[-0.02em] max-w-[16ch]"
              style={{ ...display, fontSize: h1Clamp }}
            >
              Let us talk about what your{" "}
              <span className="text-brand-orange">team</span> needs.
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-14 flex flex-wrap items-center gap-8">
              <a
                href={`mailto:${contact.email}`}
                className={`inline-flex items-center gap-2 rounded-full bg-brand-orange text-cinema-bg px-7 py-4 text-[11px] uppercase tracking-[0.22em] ${mono} font-medium`}
              >
                {contact.email} →
              </a>
              <p className={`${monoLabel} max-w-xs`}>
                Thirty minutes. No deck. We will ask what the work looks like.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 9. Footer */}
        <footer className="relative bg-cinema-bg pt-20 pb-10 border-t border-cinema-warm/10">
          <CinemaWordmark />
          <div className={`px-6 md:px-10 mt-10 flex flex-wrap items-end justify-between gap-6 ${monoLabel}`}>
            <div className="space-y-1">
              <p>Illuminate Learning · {contact.location}</p>
              <p>{contact.companyNote} · Registered in England</p>
            </div>
            <div className="flex gap-6 text-cinema-warm/75">
              <Link href="/">/index</Link>
              <Link href="/editorial">/editorial</Link>
              <Link href="/studio">/studio</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
