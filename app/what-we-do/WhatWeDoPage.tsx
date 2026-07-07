"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { whatWeDo } from "@/lib/copy";

export function WhatWeDoPage() {
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

      {/* Each service holds its own full section, alternating ground and
          raised surface, tied together by mono index labels. */}
      {whatWeDo.services.map((service, i) => (
        <ServiceSection key={service.key} service={service} index={i} />
      ))}

      <SiteFooter />
    </main>
  );
}

function ServiceSection({
  service,
  index,
}: {
  service: (typeof whatWeDo)["services"][number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const raised = index % 2 === 1;
  const reverse = index % 2 === 1;
  const accent = raised ? "text-brand-amber" : "text-brand-orange";

  const textColClass = reverse
    ? "md:col-span-7 md:col-start-6"
    : "md:col-span-7 md:col-start-1";
  const accentColClass = reverse
    ? "md:col-span-4 md:col-start-1 md:row-start-1"
    : "md:col-span-4 md:col-start-9";

  return (
    <section
      ref={ref}
      id={service.key}
      className={`relative overflow-hidden border-t border-hairline ${
        raised ? "bg-surface" : "bg-ground"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className={textColClass}>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6 }}
              className="label"
            >
              {service.eyebrow} · {service.title}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : undefined}
              transition={{ duration: 0.7, delay: 0.05 }}
              className={`mt-6 h-1 w-12 origin-left ${
                raised ? "bg-brand-amber" : "bg-brand-orange"
              }`}
            />
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display mt-7 max-w-[18ch] leading-[0.98]"
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)" }}
            >
              {service.headline}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-8 max-w-[58ch] text-lg leading-[1.6] text-text/75 md:text-xl"
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

          <div className={accentColClass}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative aspect-[3/4] overflow-hidden rounded-lg border border-hairline bg-surface-2"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_120%_at_70%_25%,rgba(249,167,29,0.22)_0%,rgba(13,11,9,0)_60%)]"
              />
              <div className="absolute inset-6 flex flex-col justify-between">
                <span
                  className={`font-mono font-semibold leading-[0.82] tabular-nums ${accent} opacity-30`}
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
