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
    <main className="font-ui min-h-dvh bg-paper text-ink">
      <SiteNav />

      <PageHero
        eyebrow="About"
        headline={
          <>
            We are the bit between the licence and{" "}
            <em className="italic text-[#f55e09]">the light bulb going on.</em>
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
      className="relative bg-paper border-t border-ink/10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9 }}
              className="font-serif-text max-w-[64ch] text-xl italic leading-[1.45] text-ink/85 md:text-2xl"
            >
              {about.body}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-serif-text mt-10 max-w-[58ch] text-lg italic leading-[1.45] text-ink/70"
            >
              {about.personality}
            </motion.p>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="rounded-sm border border-ink/15 bg-paper/60 p-6">
              <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
                Get in touch
              </p>
              <p className="font-serif-text mt-3 text-lg italic leading-[1.4] text-ink/80">
                The fastest way to find out if we are useful to you is to ask.
              </p>
              <Link
                href={about.cta.href}
                className="ignite mt-6 inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
              >
                {about.cta.label}
                <span aria-hidden>→</span>
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
      className="relative bg-ink py-28 text-paper md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-paper/55">
              {about.teamIntro}
            </p>
            <h2
              className="font-display mt-6 leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
            >
              <em className="italic text-[#f9a71d]">
                The faces in the room.
              </em>
            </h2>
          </div>
          <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-paper/45">
            {about.teamNote}
          </p>
        </div>

        {/* Editorial list, not a uniform grid of avatar tiles. Names
            and roles set in serif and indented in a staircase. */}
        <ol className="mt-16 flex flex-col divide-y divide-paper/15">
          {about.team.map((member, i) => (
            <motion.li
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08 }}
              className="grid items-baseline gap-6 py-10 md:grid-cols-12"
              style={{
                paddingLeft: `clamp(0px, ${i * 3}vw, 5rem)`,
              }}
            >
              <div className="md:col-span-3">
                <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
                  0{i + 1}
                </span>
                <p
                  className="font-display mt-2 leading-[0.95] tracking-tight"
                  style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
                >
                  {member.name}
                </p>
              </div>
              <p className="font-serif-text md:col-span-7 md:col-start-5 max-w-[58ch] text-xl italic leading-[1.4] text-paper/85 md:text-2xl">
                {member.role}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
