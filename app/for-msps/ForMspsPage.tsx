"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { forMsps } from "@/lib/copy";

export function ForMspsPage() {
  return (
    <main className="font-ui min-h-dvh bg-paper text-ink">
      <SiteNav />

      <PageHero
        eyebrow="For MSPs"
        headline={
          <>
            Partner with us,{" "}
            <em className="italic text-[#f55e09]">don't become us.</em>
          </>
        }
        body={forMsps.body}
      />

      <ModelsSection />
      <WhyItPays />

      <SiteFooter />
    </main>
  );
}

function ModelsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-ink/10 bg-ink py-28 text-paper md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-paper/55">
          Models
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8 }}
          className="font-display mt-6 max-w-[22ch] leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)" }}
        >
          {forMsps.modelsIntro}
        </motion.h2>

        {/* Staircase, not a row. Each model gets its own line with a
            generous rule, and the indents step inward so the eye flows
            through them rather than scanning across. */}
        <ol className="mt-16 flex flex-col divide-y divide-paper/15">
          {forMsps.models.map((m, i) => (
            <motion.li
              key={m.key}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
              className="grid items-baseline gap-6 py-10 md:grid-cols-12"
              style={{
                paddingLeft: `clamp(0px, ${i * 2.5}vw, 4rem)`,
              }}
            >
              <div className="md:col-span-3">
                <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
                  0{i + 1}
                </span>
                <h3
                  className="font-display mt-2 leading-[0.95] tracking-tight"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  <em className="italic text-paper">{m.title}</em>
                </h3>
              </div>
              <p className="font-serif-text md:col-span-8 md:col-start-5 max-w-[58ch] text-xl italic leading-[1.4] text-paper/85 md:text-2xl">
                {m.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhyItPays() {
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
              Why it pays
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display mt-6 leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
            >
              Margin.{" "}
              <em className="italic text-[#f55e09]">Stickiness.</em>
            </motion.h2>
          </div>
          <div className="md:col-span-7 md:pt-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="font-serif-text max-w-[60ch] text-xl italic leading-[1.45] text-ink/80 md:text-2xl"
            >
              {forMsps.whyBody}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-10"
            >
              <Link
                href={forMsps.cta.href}
                className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
              >
                {forMsps.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
