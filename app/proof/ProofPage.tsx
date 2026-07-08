"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { proof } from "@/lib/copy";

export function ProofPage() {
  return (
    <main className="font-sans min-h-dvh bg-ground text-text">
      <SiteNav />

      <PageHero
        eyebrow="proof"
        headline={
          <>
            The proof is{" "}
            <span className="text-brand-orange">in the room.</span>
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
      className="relative overflow-hidden border-t border-hairline bg-surface py-28 md:py-40"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-20%", left: "-4%", width: "55%", height: "140%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9 }}
          className="font-display max-w-[24ch] leading-[1.02]"
          style={{ fontSize: "clamp(2rem, 4.6vw, 3.75rem)" }}
        >
          {proof.pullFigure}
        </motion.h2>
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
      className="relative overflow-hidden bg-ground py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display leading-[0.98]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              See a session,{" "}
              <span className="text-brand-orange">before you book.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mt-8 max-w-[44ch] text-lg leading-[1.6] text-text/75 md:text-xl"
            >
              {proof.sampleBody}
            </motion.p>
          </div>

          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative aspect-video overflow-hidden rounded-lg border border-hairline bg-surface-2"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_30%,rgba(249,167,29,0.16)_0%,rgba(13,11,9,0)_55%)]"
              />
              <Link
                href={proof.cta.href}
                aria-label="Watch a sample session in the room"
                className="ignite absolute inset-0 flex flex-col items-center justify-center gap-4 text-center focus:outline-none"
              >
                <span
                  aria-hidden
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-ground/60 text-brand-amber"
                >
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor" aria-hidden>
                    <path d="M0 0v22l20-11z" />
                  </svg>
                </span>
                <span className="max-w-[26ch] font-mono text-[13px] leading-[1.5] text-text/75">
                  Watch a sample session in the room
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <Link href={proof.cta.href} className="btn btn-primary btn-lg ignite">
            <span aria-hidden className="btn-switch" />
            {proof.cta.label}
          </Link>
          <Link
            href={proof.primaryCta.href}
            className="ignite-text font-mono text-[12px] text-text-muted"
          >
            Or book a session
          </Link>
        </div>
      </div>
    </section>
  );
}

function Placeholders() {
  return (
    <section className="relative border-t border-hairline bg-surface py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-3xl leading-[1.05] md:text-4xl">
              Client. Challenge. <span className="text-brand-orange">Result.</span>
            </h2>
            <div className="mt-8 space-y-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-hairline bg-ground/50 p-6"
                >
                  <p className="font-mono text-[11px] tracking-[0.04em] text-text-muted">
                    Case study 0{i + 1}
                  </p>
                  <p className="mt-3 leading-[1.6] text-text/60">
                    {proof.caseStudyPlaceholder}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <h2 className="font-display text-3xl leading-[1.05] md:text-4xl">
              In <span className="text-brand-orange">their words.</span>
            </h2>
            <div className="mt-8 space-y-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-hairline bg-ground/50 p-6"
                >
                  <p className="font-mono text-[11px] tracking-[0.04em] text-text-muted">
                    Testimonial 0{i + 1}
                  </p>
                  <p className="mt-3 leading-[1.6] text-text/60">
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
