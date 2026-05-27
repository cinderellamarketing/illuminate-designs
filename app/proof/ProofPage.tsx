"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { headlineNumber, proof, statTooltip } from "@/lib/copy";

export function ProofPage() {
  return (
    <main className="font-ui min-h-dvh bg-paper text-ink">
      <SiteNav />

      <PageHero
        eyebrow="Proof"
        headline={
          <>
            The proof is{" "}
            <em className="italic text-[#f55e09]">in the room.</em>
          </>
        }
        body={proof.body}
      />

      <Pull />
      <Sample />
      <Placeholders />

      <SiteFooter />
    </main>
  );
}

function Pull() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-ink/10 bg-ink py-28 text-paper md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-paper/55">
          Pull figure
        </p>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9 }}
          title={statTooltip}
          className="mt-8"
        >
          <div
            className="font-display leading-[0.78] tracking-tight"
            style={{
              color: "#f55e09",
              fontSize: "clamp(7rem, 22vw, 22rem)",
              fontVariationSettings: '"opsz" 144',
            }}
          >
            {headlineNumber.value}
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif-text mt-6 max-w-[56ch] text-2xl italic leading-[1.3] text-paper/85"
        >
          {proof.pullFigure}
        </motion.p>
      </div>
    </section>
  );
}

function Sample() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-paper py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
              {proof.sampleHeading}
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display mt-6 leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              See a session,{" "}
              <em className="italic text-[#f55e09]">before you book.</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="font-serif-text mt-8 max-w-[44ch] text-xl italic leading-[1.4] text-ink/80"
            >
              {proof.sampleBody}
            </motion.p>
          </div>

          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative aspect-video overflow-hidden rounded-sm border border-ink/15 bg-[#0a0907] text-paper"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_30%,rgba(249,167,29,0.16)_0%,rgba(10,9,7,0)_55%)]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-ui text-[10px] uppercase tracking-[0.28em] text-[#f9a71d]/80">
                  Sample clip
                </span>
                <span className="font-serif-text mt-4 max-w-[28ch] text-xl italic leading-[1.35] text-paper/80">
                  {proof.samplePlaceholder}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <Link
            href={proof.primaryCta.href}
            className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
          >
            {proof.primaryCta.label}
            <span aria-hidden>→</span>
          </Link>
          <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
            Or talk to us first
          </span>
        </div>
      </div>
    </section>
  );
}

function Placeholders() {
  return (
    <section className="relative border-t border-ink/10 bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
              Case studies
            </p>
            <h2 className="font-display mt-6 text-3xl leading-[1.05] tracking-tight md:text-4xl">
              <em className="italic text-[#f55e09]">Client. Challenge. Result.</em>
            </h2>
            <div className="mt-8 space-y-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-sm border border-ink/15 bg-paper/60 p-6"
                >
                  <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-ink/45">
                    Case study 0{i + 1}
                  </p>
                  <p className="font-serif-text mt-3 text-lg italic leading-[1.4] text-ink/65">
                    {proof.caseStudyPlaceholder}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
              Testimonials
            </p>
            <h2 className="font-display mt-6 text-3xl leading-[1.05] tracking-tight md:text-4xl">
              <em className="italic text-[#f55e09]">In their words.</em>
            </h2>
            <div className="mt-8 space-y-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="rounded-sm border border-ink/15 bg-paper/60 p-6"
                >
                  <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-ink/45">
                    Testimonial 0{i + 1}
                  </p>
                  <p className="font-serif-text mt-3 text-lg italic leading-[1.4] text-ink/65">
                    {proof.testimonialPlaceholder}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
