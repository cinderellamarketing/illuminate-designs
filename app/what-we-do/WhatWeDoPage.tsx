"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { whatWeDo } from "@/lib/copy";

type Service = (typeof whatWeDo)["services"][number];

export function WhatWeDoPage() {
  const [lead, band, focus] = whatWeDo.services;
  return (
    <main className="font-sans min-h-dvh bg-ground text-text">
      <SiteNav />

      <PageHero
        eyebrow="what we do"
        headline={
          <>
            Training people{" "}
            <span className="text-brand-orange">want to be in.</span>
          </>
        }
        body={whatWeDo.body}
      />

      {/* Three services, three silhouettes. The first is the flagship, with a
          tall number card; the second runs as a wide horizontal band with the
          index as a graphic and only a quiet link; the third is a centred
          close. The mono numbering is the thread, not a repeated kicker. */}
      <ServiceLead service={lead} index={0} />
      <ServiceBand service={band} index={1} />
      <ServiceFocus service={focus} index={2} />

      <SiteFooter />
    </main>
  );
}

// 01 — flagship. Left text block, tall portrait number card on the right.
function ServiceLead({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      id={service.key}
      className="relative overflow-hidden border-t border-hairline bg-ground"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : undefined}
              transition={{ duration: 0.7 }}
              className="h-1 w-12 origin-left bg-brand-orange"
            />
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="font-display mt-7 max-w-[16ch] leading-[0.96]"
              style={{ fontSize: "clamp(2.5rem, 6.5vw, 6rem)" }}
            >
              {service.headline}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-8 max-w-[56ch] text-lg leading-[1.6] text-text/75 md:text-xl"
            >
              {service.body}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-10"
            >
              <Link href={service.cta.href} className="btn btn-primary ignite">
                {service.cta.label}
              </Link>
            </motion.div>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative aspect-[3/4] overflow-hidden rounded-lg border border-hairline bg-surface-2"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_120%_at_70%_25%,rgba(245,94,9,0.22)_0%,rgba(13,11,9,0)_60%)]"
              />
              <div className="absolute inset-6 flex flex-col justify-between">
                <span
                  className="font-mono font-semibold leading-[0.82] tabular-nums text-brand-orange opacity-30"
                  style={{ fontSize: "clamp(4.5rem, 9vw, 9rem)" }}
                >
                  0{index + 1}
                </span>
                <span className="font-mono text-[11px] tracking-[0.06em] text-text-muted">
                  {service.title}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 02 — a wide horizontal band. The index sits large as a graphic on the left,
// the copy runs across to the right, and it closes on a quiet link, not a
// button. No card, so the silhouette reads nothing like the flagship.
function ServiceBand({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      id={service.key}
      className="relative overflow-hidden border-t border-hairline bg-surface"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <motion.span
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.8 }}
            aria-hidden
            className="font-mono font-semibold leading-[0.8] tabular-nums text-brand-amber/25 md:col-span-3"
            style={{ fontSize: "clamp(5rem, 12vw, 13rem)" }}
          >
            0{index + 1}
          </motion.span>
          <div className="md:col-span-8 md:col-start-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display leading-[1.0]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
            >
              {service.headline}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-6 max-w-[68ch] text-lg leading-[1.6] text-text/75 md:text-xl"
            >
              {service.body}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-8"
            >
              <Link
                href={service.cta.href}
                className="ignite-text inline-flex items-center gap-2 font-mono text-[13px] text-brand-amber"
              >
                {service.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 03 — a centred close. The largest headline of the three, a light pool behind
// it, and the full button. Centre-weighted, so it sits apart from the two above.
function ServiceFocus({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      id={service.key}
      className="relative overflow-hidden border-t border-hairline bg-ground"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-20%", left: "20%", width: "60%", height: "140%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
            className="font-mono text-[12px] tracking-[0.06em] text-brand-orange"
          >
            0{index + 1}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display mt-6 max-w-[15ch] leading-[0.95]"
            style={{ fontSize: "clamp(2.75rem, 7vw, 6.5rem)" }}
          >
            {service.headline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-8 max-w-[54ch] text-lg leading-[1.6] text-text/75 md:text-xl"
          >
            {service.body}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-10"
          >
            <Link
              href={service.cta.href}
              className="btn btn-primary btn-lg ignite"
            >
              <span aria-hidden className="btn-switch" />
              {service.cta.label}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
