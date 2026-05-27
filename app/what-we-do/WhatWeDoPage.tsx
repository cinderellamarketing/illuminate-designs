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
    <main className="font-ui min-h-dvh bg-paper text-ink">
      <SiteNav />

      <PageHero
        eyebrow="What we do"
        headline={
          <>
            Training people{" "}
            <em className="italic text-[#f55e09]">want to be in.</em>
          </>
        }
        body={whatWeDo.body}
      />

      {/* Editorial services, never an equal row. Each is its own full
          section with alternating layouts and a clear rule between
          them. The eyebrow numbers tie them together. */}
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
  const dark = index === 1;
  const reverse = index % 2 === 1;

  // Text on the left for odd-indexed sections, right for even. The
  // accent panel takes the opposite side. Achieved via col-start so
  // we don't fight with RTL.
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
      className={`relative overflow-hidden border-t ${
        dark
          ? "border-paper/10 bg-ink text-paper"
          : "border-ink/10 bg-paper text-ink"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className={textColClass}>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6 }}
              className={`font-ui text-[11px] uppercase tracking-[0.22em] ${
                dark ? "text-paper/55" : "text-ink/55"
              }`}
            >
              {service.eyebrow} · {service.title}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display mt-6 max-w-[18ch] leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 5.5rem)" }}
            >
              <em
                className={
                  dark
                    ? "italic text-[#f9a71d]"
                    : "italic text-[#f55e09]"
                }
              >
                {service.headline}
              </em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className={`font-serif-text mt-8 max-w-[58ch] text-xl italic leading-[1.4] md:text-2xl ${
                dark ? "text-paper/85" : "text-ink/80"
              }`}
            >
              {service.body}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-10"
            >
              <Link
                href={service.cta.href}
                className={`ignite inline-flex items-center gap-3 rounded-full px-6 py-3 text-[12px] uppercase tracking-[0.18em] transition ${
                  dark
                    ? "bg-[#f9a71d] text-ink hover:bg-[#fbbe4d]"
                    : "bg-[#f55e09] text-white hover:bg-[#d24f06]"
                }`}
              >
                {service.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>

          <div className={accentColClass}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 }}
              className={`relative aspect-[3/4] overflow-hidden rounded-sm ${
                dark ? "bg-[#0c0a07]" : "bg-[#efe7d7]"
              }`}
            >
              <div
                aria-hidden
                className={`absolute inset-0 ${
                  dark
                    ? "bg-[radial-gradient(120%_120%_at_70%_30%,rgba(249,167,29,0.22)_0%,rgba(11,10,8,0)_60%)]"
                    : "bg-[radial-gradient(120%_120%_at_70%_30%,rgba(245,94,9,0.18)_0%,rgba(244,237,224,0)_60%)]"
                }`}
              />
              <div className="absolute inset-6 flex flex-col justify-between">
                <span
                  className="font-display leading-[0.82] tracking-tight"
                  style={{
                    fontSize: "clamp(4.5rem, 9vw, 9rem)",
                    color: dark
                      ? "rgba(244, 237, 224, 0.18)"
                      : "rgba(11, 10, 8, 0.18)",
                    fontVariationSettings: '"opsz" 144',
                  }}
                >
                  0{index + 1}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-[0.28em] ${
                    dark ? "text-paper/60" : "text-ink/55"
                  }`}
                >
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
