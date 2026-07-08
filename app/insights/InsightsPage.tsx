"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { insights } from "@/lib/copy";

export function InsightsPage() {
  return (
    <main className="font-sans min-h-dvh bg-ground text-text">
      <SiteNav />

      <PageHero
        eyebrow="insights"
        headline={
          <>
            {insights.headline.lead}{" "}
            <span className="text-brand-orange">{insights.headline.accent}</span>
          </>
        }
        body={insights.body}
      />

      <Sections />

      <SiteFooter />
    </main>
  );
}

function Sections() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      className="relative border-t border-hairline bg-ground py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {insights.sections.map((section, i) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.1 }}
            className={`grid gap-10 md:grid-cols-12 ${
              i > 0 ? "mt-20 border-t border-hairline pt-20" : ""
            }`}
          >
            <div className="md:col-span-4">
              <h2
                className="font-display leading-[0.98]"
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)" }}
              >
                <span className="text-brand-orange">{section.title}</span>
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="max-w-[60ch] text-lg leading-[1.65] text-text/75 md:text-xl">
                {section.body}
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="ignite rounded-lg border border-hairline bg-surface p-6"
                  >
                    <p className="font-mono text-[11px] tracking-[0.04em] text-text-muted">
                      {section.title} · 0{j + 1}
                    </p>
                    <p className="mt-3 leading-[1.6] text-text/65">
                      [Title to follow.]
                    </p>
                    <Link
                      href={insights.cta.href}
                      className="ignite-text mt-4 inline-flex items-center gap-2 font-mono text-[12px] text-brand-orange"
                    >
                      {insights.cta.label}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
