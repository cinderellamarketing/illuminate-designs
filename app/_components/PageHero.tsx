"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Standard top-of-page hero for inner pages. Editorial, calmer than
// the homepage heroes, but unmistakably the same character: italic
// orange accent, big serif headline, single-column flow.
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
    <section ref={ref} className="relative bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 pt-24 pb-20 md:px-10 md:pt-32 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6 }}
          className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="font-display mt-6 max-w-[22ch] leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
        >
          {headline}
        </motion.h1>
        {body && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif-text mt-10 max-w-[60ch] text-xl italic leading-[1.4] text-ink/80 md:text-2xl"
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
