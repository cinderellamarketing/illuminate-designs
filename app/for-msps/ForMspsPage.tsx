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
    <main className="font-sans min-h-dvh bg-ground text-text">
      <SiteNav />

      <PageHero
        eyebrow="for MSPs"
        headline={
          <>
            {forMsps.headline.lead}{" "}
            <span className="text-brand-orange">{forMsps.headline.accent}</span>
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
      className="relative overflow-hidden border-t border-hairline bg-surface py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8 }}
          className="font-display max-w-[22ch] leading-[0.98]"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)" }}
        >
          {forMsps.modelsIntro}
        </motion.h2>

        {/* Staircase, not a row. Each model indents inward. */}
        <ol className="mt-16 flex flex-col divide-y divide-hairline">
          {forMsps.models.map((m, i) => (
            <motion.li
              key={m.key}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
              className="grid items-baseline gap-6 py-10 md:grid-cols-12"
              style={{ paddingLeft: `clamp(0px, ${i * 2.5}vw, 4rem)` }}
            >
              <div className="md:col-span-3">
                <span className="font-mono text-[12px] text-brand-amber">
                  0{i + 1}
                </span>
                <h3
                  className="font-display mt-2 leading-[0.98]"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
                >
                  {m.title}
                </h3>
              </div>
              <p className="md:col-span-8 md:col-start-5 max-w-[58ch] text-lg leading-[1.6] text-text/80 md:text-xl">
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
      className="relative overflow-hidden bg-ground py-28 md:py-40"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-10%", left: "-6%", width: "50%", height: "120%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display leading-[0.98]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              Margin.{" "}
              <span className="text-brand-orange">Stickiness.</span>
            </motion.h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="max-w-[60ch] text-lg leading-[1.6] text-text/80 md:text-xl"
            >
              {forMsps.whyBody}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-10"
            >
              <Link href={forMsps.cta.href} className="btn btn-primary btn-lg ignite">
                <span aria-hidden className="btn-switch" />
                {forMsps.cta.label}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
