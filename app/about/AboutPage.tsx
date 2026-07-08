"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { about } from "@/lib/copy";

export function AboutPage() {
  return (
    <main className="font-sans min-h-dvh bg-ground text-text">
      <SiteNav />

      <PageHero
        eyebrow="about"
        headline={
          <>
            {about.headline.lead}{" "}
            <span className="text-brand-orange">{about.headline.accent}</span>
          </>
        }
      />

      <Story />
      <Team />

      <SiteFooter />
    </main>
  );
}

function Story() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-hairline bg-ground py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9 }}
              className="max-w-[64ch] text-lg leading-[1.65] text-text/85 md:text-xl"
            >
              {about.body}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-10 max-w-[58ch] text-lg leading-[1.65] text-text/70"
            >
              {about.personality}
            </motion.p>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="rounded-lg border border-hairline bg-surface p-6">
              <p className="label">get in touch</p>
              <p className="mt-3 leading-[1.6] text-text/80">
                The fastest way to find out if we are useful to you is to ask.
              </p>
              <Link
                href={about.cta.href}
                className="btn btn-primary ignite mt-6"
              >
                {about.cta.label}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Team() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      className="relative border-t border-hairline bg-surface py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2
              className="font-display leading-[0.98]"
              style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
            >
              The faces{" "}
              <span className="text-brand-amber">in the room.</span>
            </h2>
          </div>
          <p className="font-mono text-[11px] tracking-[0.04em] text-text-muted">
            {about.teamNote}
          </p>
        </div>

        {/* Editorial list, indented in a staircase. */}
        <ol className="mt-16 flex flex-col divide-y divide-hairline">
          {about.team.map((member, i) => (
            <motion.li
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08 }}
              className="grid items-baseline gap-6 py-10 md:grid-cols-12"
              style={{ paddingLeft: `clamp(0px, ${i * 3}vw, 5rem)` }}
            >
              <div className="md:col-span-3">
                <span className="font-mono text-[12px] text-brand-amber">
                  0{i + 1}
                </span>
                <p
                  className="font-display mt-2 leading-[0.98]"
                  style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
                >
                  {member.name}
                </p>
              </div>
              <p className="md:col-span-7 md:col-start-5 max-w-[58ch] text-lg leading-[1.6] text-text/80 md:text-xl">
                {member.role}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
