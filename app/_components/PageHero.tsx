"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Standard top-of-page hero for inner pages. Calmer than the homepage
// heroes, but the same lit-dark character: a small mono label, a heavy
// wide display headline with a warm light pool resting behind it, and a
// plain body line. No serif, no eyebrow dot, no italic accent.
export function PageHero({
  eyebrow,
  headline,
  body,
  accent,
}: {
  eyebrow: string;
  headline: React.ReactNode;
  body?: string;
  accent?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-ground">
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-30%", left: "-8%", width: "62%", height: "130%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-20 md:px-10 md:pt-32 md:pb-28">
        <div className="grid gap-x-10 md:grid-cols-12">
          <div className="md:col-span-10">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6 }}
              className="label"
            >
              {eyebrow}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : undefined}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 h-1 w-14 origin-left bg-brand-orange"
            />
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display mt-7 max-w-[20ch] leading-[0.98]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}
            >
              {headline}
            </motion.h1>
          </div>
        </div>
        {body && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-10 max-w-[58ch] text-lg leading-[1.55] text-text/75 md:text-xl"
          >
            {body}
          </motion.p>
        )}
        {accent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10"
          >
            {accent}
          </motion.div>
        )}
      </div>
    </section>
  );
}
