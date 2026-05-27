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
    <main className="font-ui min-h-dvh bg-paper text-ink">
      <SiteNav />

      <PageHero
        eyebrow="Insights"
        headline={
          <>
            Things worth knowing about Copilot, adoption{" "}
            <em className="italic text-[#f55e09]">and the channel.</em>
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
      className="relative bg-paper border-t border-ink/10 py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {insights.sections.map((section, i) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.1 }}
            className={`grid gap-10 md:grid-cols-12 ${
              i > 0 ? "mt-20 border-t border-ink/10 pt-20" : ""
            }`}
          >
            <div className="md:col-span-4">
              <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
                Section 0{i + 1}
              </p>
              <h2
                className="font-display mt-6 leading-[0.95] tracking-tight"
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)" }}
              >
                <em className="italic text-[#f55e09]">{section.title}</em>
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="font-serif-text max-w-[60ch] text-xl italic leading-[1.45] text-ink/75 md:text-2xl">
                {section.body}
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="ignite rounded-sm border border-ink/15 bg-paper/60 p-6"
                  >
                    <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-ink/45">
                      {section.title} · 0{j + 1}
                    </p>
                    <p className="font-serif-text mt-3 text-lg italic leading-[1.4] text-ink/65">
                      [Title to follow.]
                    </p>
                    <Link
                      href={insights.cta.href}
                      className="ignite-text mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#f55e09]"
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
