"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { clients, pillars, approachPoints, team, stat, caseStudy } from "@/lib/copy";
import { useIsTouch } from "@/lib/useIsTouch";

/* ───── Global torch overlay ───── */
function Torch({
  mx,
  my,
  radius,
}: {
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
  radius: ReturnType<typeof useTransform<number, number>>;
}) {
  const bg = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(245,240,232,0.05) 0%, rgba(245,94,9,0.06) 40%, transparent 70%)`;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
      style={{ background: bg }}
    />
  );
}

/* ───── TorchReveal: dim base + bright layer masked by cursor ───── */
function TorchReveal({
  children,
  className = "",
  bright = "text-cinema-warm",
  radius = 240,
  isTouch,
}: {
  children: React.ReactNode;
  className?: string;
  bright?: string;
  radius?: number;
  isTouch: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isTouch]);

  if (isTouch) {
    // Touch fallback: render bright directly
    return <span className={`${bright} ${className}`}>{children}</span>;
  }

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="text-cinema-dim">{children}</span>
      <span
        aria-hidden
        className={`absolute inset-0 ${bright}`}
        style={{
          WebkitMaskImage: `radial-gradient(${radius}px circle at var(--mx, -9999px) var(--my, -9999px), #000 0%, rgba(0,0,0,0.85) 40%, transparent 75%)`,
          maskImage: `radial-gradient(${radius}px circle at var(--mx, -9999px) var(--my, -9999px), #000 0%, rgba(0,0,0,0.85) 40%, transparent 75%)`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ───── Word-by-word horizontal reveal ───── */
function WordReveal({
  text,
  className = "",
  bright = "text-cinema-warm",
  isTouch,
}: {
  text: string;
  className?: string;
  bright?: string;
  isTouch: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const words = text.split(" ");
  return (
    <div ref={ref} className={`flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, x: -18 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 0.61, 0.36, 1],
            delay: i * 0.04,
          }}
        >
          <TorchReveal bright={bright} isTouch={isTouch}>
            {w}
          </TorchReveal>
        </motion.span>
      ))}
    </div>
  );
}

/* ───── Pillar node ───── */
function PillarNode({
  num,
  title,
  body,
  isTouch,
}: {
  num: string;
  title: string;
  body: string;
  isTouch: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(isTouch);

  useEffect(() => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      setLit(d < 280);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isTouch]);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute -inset-12 rounded-full transition-opacity duration-500"
        style={{
          opacity: lit ? 1 : 0,
          background:
            "radial-gradient(circle, rgba(245,94,9,0.22) 0%, rgba(245,94,9,0.06) 35%, transparent 65%)",
        }}
      />
      <div className="relative flex flex-col items-start gap-5">
        <div
          aria-hidden
          className="h-3 w-3 rounded-full transition-all duration-500"
          style={{
            background: lit ? "#f55e09" : "#2a2622",
            boxShadow: lit ? "0 0 28px 6px rgba(245,94,9,0.7)" : "none",
          }}
        />
        <p
          className={`text-[10px] uppercase tracking-[0.28em] transition-colors duration-500 [font-family:var(--font-plex-mono)] ${
            lit ? "text-brand-orange" : "text-cinema-dim"
          }`}
        >
          Programme {num}
        </p>
        <h3
          className={`text-3xl md:text-5xl leading-[1.05] transition-colors duration-500`}
          style={{
            fontFamily: "var(--font-instrument)",
            fontStyle: "italic",
            color: lit ? "#f5f0e8" : "#2a2622",
          }}
        >
          {title}.
        </h3>
        <p
          className={`text-base md:text-lg max-w-sm transition-all duration-500 [font-family:var(--font-plex-sans)] ${
            lit ? "opacity-100 text-cinema-warm/85" : "opacity-30 text-cinema-dim"
          }`}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/* ───── Footer wordmark — animated across ───── */
function CinemaWordmark({ isTouch }: { isTouch: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isTouch]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden">
      <motion.div
        initial={{ x: "10%", opacity: 0 }}
        animate={inView ? { x: "0%", opacity: 1 } : { x: "10%", opacity: 0 }}
        transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative"
      >
        <h2
          aria-hidden
          className="text-[22vw] leading-[0.85] tracking-[-0.04em] text-cinema-dim whitespace-nowrap"
          style={{
            fontFamily: "var(--font-instrument)",
            fontStyle: "italic",
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
            filter: "drop-shadow(0 0 24px rgba(245,94,9,0.4))",
          }}
        >
          Illuminate
        </h2>
        <span className="sr-only">Illuminate</span>
      </motion.div>
    </div>
  );
}

export default function CinemaPage() {
  const isTouch = useIsTouch();

  // Global cursor with spring smoothing
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 220, damping: 28, mass: 0.4 });
  const my = useSpring(rawY, { stiffness: 220, damping: 28, mass: 0.4 });

  // Scroll progress → torch radius (more focused on first viewport, opens up as you read)
  const { scrollYProgress } = useScroll();
  const radius = useTransform(scrollYProgress, [0, 0.3, 1], [340, 460, 520]);

  // Idle / mouse-out: drift to centre
  useEffect(() => {
    if (isTouch) return;
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
  }, [isTouch, rawX, rawY]);

  return (
    <main
      className="relative bg-cinema-bg text-cinema-warm min-h-dvh overflow-x-hidden"
      style={{ fontFamily: "var(--font-plex-sans)" }}
    >
      {!isTouch && <Torch mx={mx} my={my} radius={radius} />}

      {/* Header */}
      <header className="relative z-40 px-6 md:px-10 pt-6 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.28em] text-cinema-warm/60 hover:text-cinema-warm [font-family:var(--font-plex-mono)]"
        >
          ← /index
        </Link>
        <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.28em] [font-family:var(--font-plex-mono)]">
          <a href="#approach" className="text-cinema-warm/60 hover:text-cinema-warm">Approach</a>
          <a href="#work" className="text-cinema-warm/60 hover:text-cinema-warm">Case</a>
          <a href="#team" className="text-cinema-warm/60 hover:text-cinema-warm">Team</a>
          <a href="#contact" className="text-brand-orange">Contact</a>
        </nav>
        <span className="text-[10px] uppercase tracking-[0.28em] text-cinema-warm/60 [font-family:var(--font-plex-mono)]">
          /cinema · move your cursor
        </span>
      </header>

      {/* 1. Hero — find the line with the torch */}
      <section className="relative px-6 md:px-10 pt-24 md:pt-40 pb-32 md:pb-52">
        <div className="text-[10px] uppercase tracking-[0.28em] text-cinema-dim [font-family:var(--font-plex-mono)] mb-10">
          <TorchReveal bright="text-cinema-warm/70" isTouch={isTouch}>
            01 · Microsoft Copilot · Adoption that lasts
          </TorchReveal>
        </div>

        <h1
          className="text-[14vw] md:text-[11vw] leading-[0.9] tracking-[-0.025em]"
          style={{
            fontFamily: "var(--font-instrument)",
            fontStyle: "italic",
          }}
        >
          <span className="block">
            <TorchReveal bright="text-cinema-warm" radius={300} isTouch={isTouch}>
              Training built for
            </TorchReveal>
          </span>
          <span className="block">
            <TorchReveal bright="text-cinema-warm" radius={300} isTouch={isTouch}>
              the way{" "}
            </TorchReveal>
            <TorchReveal bright="text-brand-orange" radius={300} isTouch={isTouch}>
              work
            </TorchReveal>{" "}
            <TorchReveal bright="text-cinema-warm" radius={300} isTouch={isTouch}>
              actually happens.
            </TorchReveal>
          </span>
        </h1>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7 text-lg md:text-xl max-w-prose">
            <TorchReveal bright="text-cinema-warm/85" radius={300} isTouch={isTouch}>
              Role-specific Copilot programmes for sales floors, service desks
              and senior teams. Built around the job, measured against the work,
              followed up for ninety days after the last classroom day.
            </TorchReveal>
          </div>
          <div className="md:col-span-5 md:text-right">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-cinema-warm/30 px-6 py-3 text-[11px] uppercase tracking-[0.22em] [font-family:var(--font-plex-mono)] hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              Book a discovery call →
            </a>
          </div>
        </div>
      </section>

      {/* 2. Logo strip */}
      <section className="border-y border-cinema-warm/10 px-6 md:px-10 py-8">
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
          <span className="text-[10px] uppercase tracking-[0.28em] text-cinema-dim [font-family:var(--font-plex-mono)] mr-2">
            <TorchReveal bright="text-cinema-warm/60" isTouch={isTouch}>
              Trusted on the floor at
            </TorchReveal>
          </span>
          {clients.map((c) => (
            <span
              key={c}
              className="text-lg md:text-xl"
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
              }}
            >
              <TorchReveal bright="text-cinema-warm/85" isTouch={isTouch}>
                {c}
              </TorchReveal>
            </span>
          ))}
        </div>
      </section>

      {/* 3. Problem */}
      <section className="px-6 md:px-10 py-32 md:py-44">
        <p className="text-[10px] uppercase tracking-[0.28em] text-cinema-dim [font-family:var(--font-plex-mono)] mb-10">
          <TorchReveal bright="text-cinema-warm/60" isTouch={isTouch}>
            02 · The problem
          </TorchReveal>
        </p>
        <WordReveal
          text="Every team has the tools. Far fewer have the skills."
          isTouch={isTouch}
          className="text-5xl md:text-8xl leading-[0.95] tracking-[-0.015em]"
          bright="text-cinema-warm"
        />
        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p
              className="text-[26vw] md:text-[14vw] leading-[0.82] tracking-[-0.04em]"
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
              }}
            >
              <TorchReveal bright="text-brand-orange" radius={400} isTouch={isTouch}>
                {stat.hero}
              </TorchReveal>
            </p>
          </div>
          <div className="md:col-span-5 md:pl-8 md:border-l border-cinema-warm/10">
            <p
              className="text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-plex-sans)" }}
            >
              <TorchReveal bright="text-cinema-warm" isTouch={isTouch}>
                {stat.heroLabel}.
              </TorchReveal>
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.28em] [font-family:var(--font-plex-mono)] text-cinema-dim">
              <TorchReveal bright="text-cinema-warm/55" isTouch={isTouch}>
                Source · {stat.source}
              </TorchReveal>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Pillars — three glowing nodes */}
      <section className="px-6 md:px-10 py-28 md:py-40 border-t border-cinema-warm/10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-cinema-dim [font-family:var(--font-plex-mono)] mb-10">
          <TorchReveal bright="text-cinema-warm/60" isTouch={isTouch}>
            03 · What we run
          </TorchReveal>
        </p>
        <WordReveal
          text="Three programmes. Hover to light each one."
          isTouch={isTouch}
          className="text-4xl md:text-6xl leading-[0.95] tracking-[-0.01em] max-w-4xl"
          bright="text-cinema-warm"
        />
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
          {pillars.map((p) => (
            <PillarNode
              key={p.number}
              num={p.number}
              title={p.title}
              body={p.body}
              isTouch={isTouch}
            />
          ))}
        </div>
      </section>

      {/* 5. Approach */}
      <section id="approach" className="px-6 md:px-10 py-28 md:py-40 border-t border-cinema-warm/10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-cinema-dim [font-family:var(--font-plex-mono)] mb-10">
          <TorchReveal bright="text-cinema-warm/60" isTouch={isTouch}>
            04 · How we work
          </TorchReveal>
        </p>
        <WordReveal
          text="We do not deliver courses. We change behaviour."
          isTouch={isTouch}
          className="text-5xl md:text-8xl leading-[0.95] tracking-[-0.015em]"
          bright="text-cinema-warm"
        />
        <div className="mt-20 grid gap-12">
          {approachPoints.map((a) => (
            <article
              key={a.number}
              className="grid grid-cols-12 gap-6 items-baseline border-t border-cinema-warm/10 pt-10"
            >
              <div className="col-span-12 md:col-span-2">
                <span
                  className="text-5xl md:text-7xl text-brand-orange"
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontStyle: "italic",
                  }}
                >
                  <TorchReveal bright="text-brand-orange" isTouch={isTouch}>
                    {a.number}
                  </TorchReveal>
                </span>
              </div>
              <div className="col-span-12 md:col-span-10">
                <h3
                  className="text-3xl md:text-5xl leading-[1.05]"
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontStyle: "italic",
                  }}
                >
                  <TorchReveal bright="text-cinema-warm" isTouch={isTouch}>
                    {a.title}.
                  </TorchReveal>
                </h3>
                <p className="mt-4 text-lg md:text-xl max-w-2xl">
                  <TorchReveal bright="text-cinema-warm/85" radius={280} isTouch={isTouch}>
                    {a.body}
                  </TorchReveal>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Case study */}
      <section id="work" className="px-6 md:px-10 py-32 md:py-44 border-t border-cinema-warm/10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-cinema-dim [font-family:var(--font-plex-mono)] mb-10">
          <TorchReveal bright="text-cinema-warm/60" isTouch={isTouch}>
            05 · Case study · MSP channel partner
          </TorchReveal>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p
              className="text-[34vw] md:text-[18vw] leading-[0.82] tracking-[-0.04em]"
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
              }}
            >
              <TorchReveal bright="text-brand-orange" radius={460} isTouch={isTouch}>
                {`${caseStudy.number}${caseStudy.suffix}`}
              </TorchReveal>
            </p>
            <p
              className="mt-4 text-2xl md:text-3xl max-w-md"
              style={{ fontFamily: "var(--font-plex-sans)" }}
            >
              <TorchReveal bright="text-cinema-warm" isTouch={isTouch}>
                {caseStudy.label}.
              </TorchReveal>
            </p>
          </div>
          <div className="md:col-span-5 md:pl-8 md:border-l border-cinema-warm/10">
            <blockquote
              className="text-xl md:text-2xl leading-[1.4]"
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
              }}
            >
              <TorchReveal bright="text-cinema-warm" radius={320} isTouch={isTouch}>
                &ldquo;{caseStudy.quote}&rdquo;
              </TorchReveal>
            </blockquote>
            <p className="mt-6 text-[10px] uppercase tracking-[0.28em] [font-family:var(--font-plex-mono)] text-cinema-dim">
              <TorchReveal bright="text-cinema-warm/65" isTouch={isTouch}>
                {caseStudy.attribution}
              </TorchReveal>
            </p>
          </div>
        </div>
      </section>

      {/* 7. Team */}
      <section id="team" className="px-6 md:px-10 py-28 md:py-40 border-t border-cinema-warm/10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-cinema-dim [font-family:var(--font-plex-mono)] mb-10">
          <TorchReveal bright="text-cinema-warm/60" isTouch={isTouch}>
            06 · The bench
          </TorchReveal>
        </p>
        <WordReveal
          text="A small team of practitioners. Light each name to read more."
          isTouch={isTouch}
          className="text-3xl md:text-5xl max-w-4xl leading-[1.05]"
          bright="text-cinema-warm"
        />
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {team.map((m) => (
            <article key={m.name} className="border-t border-cinema-warm/15 pt-5">
              <div className="aspect-[4/5] w-full mb-4 bg-cinema-warm/5 grid place-items-center">
                <span
                  className="text-5xl"
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontStyle: "italic",
                  }}
                >
                  <TorchReveal bright="text-brand-orange/85" radius={160} isTouch={isTouch}>
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </TorchReveal>
                </span>
              </div>
              <h3
                className="text-xl"
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontStyle: "italic",
                }}
              >
                <TorchReveal bright="text-cinema-warm" isTouch={isTouch}>
                  {m.name}
                </TorchReveal>
              </h3>
              <p className="text-[10px] uppercase tracking-[0.22em] [font-family:var(--font-plex-mono)] mt-1 text-cinema-dim">
                <TorchReveal bright="text-cinema-warm/60" isTouch={isTouch}>
                  {m.role}
                </TorchReveal>
              </p>
              <p className="mt-3 text-sm">
                <TorchReveal bright="text-cinema-warm/80" radius={220} isTouch={isTouch}>
                  {m.bio}
                </TorchReveal>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Final CTA */}
      <section
        id="contact"
        className="px-6 md:px-10 py-32 md:py-48 border-t border-cinema-warm/10"
      >
        <p className="text-[10px] uppercase tracking-[0.28em] text-cinema-dim [font-family:var(--font-plex-mono)] mb-10">
          <TorchReveal bright="text-cinema-warm/60" isTouch={isTouch}>
            07 · Get in touch
          </TorchReveal>
        </p>
        <h2
          className="text-[12vw] md:text-[9vw] leading-[0.9] tracking-[-0.02em] max-w-[14ch]"
          style={{
            fontFamily: "var(--font-instrument)",
            fontStyle: "italic",
          }}
        >
          <TorchReveal bright="text-cinema-warm" radius={380} isTouch={isTouch}>
            Let us talk about what your{" "}
          </TorchReveal>
          <TorchReveal bright="text-brand-orange" radius={380} isTouch={isTouch}>
            team
          </TorchReveal>
          <TorchReveal bright="text-cinema-warm" radius={380} isTouch={isTouch}>
            {" "}needs.
          </TorchReveal>
        </h2>
        <div className="mt-16 flex flex-wrap items-center gap-8">
          <a
            href="mailto:hello@illuminate.training"
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange text-cinema-bg px-7 py-4 text-[11px] uppercase tracking-[0.22em] [font-family:var(--font-plex-mono)] font-medium"
          >
            hello@illuminate.training →
          </a>
          <p className="text-[11px] uppercase tracking-[0.22em] [font-family:var(--font-plex-mono)] text-cinema-dim max-w-xs">
            <TorchReveal bright="text-cinema-warm/65" isTouch={isTouch}>
              Thirty minutes. No deck. We will ask what the work looks like.
            </TorchReveal>
          </p>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="relative bg-cinema-bg pt-24 pb-10 border-t border-cinema-warm/10">
        <CinemaWordmark isTouch={isTouch} />
        <div className="px-6 md:px-10 mt-10 flex flex-wrap items-end justify-between gap-6 text-[10px] uppercase tracking-[0.28em] [font-family:var(--font-plex-mono)] text-cinema-dim">
          <div className="space-y-1">
            <p>Illuminate Learning · Manchester &amp; London</p>
            <p>Company no. 14582910 · Registered in England</p>
          </div>
          <div className="flex gap-6 text-cinema-warm/70">
            <Link href="/">/index</Link>
            <Link href="/editorial">/editorial</Link>
            <Link href="/studio">/studio</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
