import Link from "next/link";
import type { Metadata } from "next";
import { company, headlineNumber } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Two directions, in the room",
  description:
    "Two concept directions for Illuminate Learning's homepage, both built around the idea of stepping into a live training session.",
};

const directions = [
  {
    href: "/session",
    label: "/session",
    title: "In the room",
    summary:
      "Recognisably a website. Clear nav, a persistent booking CTA, footage doing the heavy lifting.",
    role: "Distinctive but converts",
  },
  {
    href: "/room",
    label: "/room",
    title: "The room",
    summary:
      "Less like a website, more like a filmed experience you scroll through. A single session, told as scenes.",
    role: "Experimental, accepts risk",
  },
] as const;

export default function IndexPage() {
  return (
    <main className="font-ui min-h-dvh bg-paper text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-[1400px] items-baseline justify-between px-6 py-8 md:px-10 md:py-10">
          <span className="font-display text-2xl italic tracking-tight">
            Illuminate
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink/55">
            Two homepage directions · {company.location}
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-6 pt-20 pb-12 md:px-10 md:pt-28">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/55">
          The organising idea
        </p>
        <h1
          className="font-display mt-6 max-w-[18ch] leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
        >
          You are in the <em className="text-[#f55e09]">room.</em>
        </h1>
        <p className="font-serif-text mt-10 max-w-[58ch] text-2xl italic leading-[1.3] text-ink/80">
          Both directions recreate the feeling of sitting in on a live Illuminate
          training session. Real footage and real faces, the same hero number
          ({headlineNumber.value} Copilot adoption), interpreted at two
          different levels of risk.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-0 px-6 pb-32 md:grid-cols-2 md:gap-px md:bg-ink/10 md:px-10">
        {directions.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group relative block bg-paper p-10 md:p-14 transition-colors hover:bg-ink hover:text-paper"
          >
            <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-current/55">
              <span>{d.label}</span>
              <span className="text-[#f55e09]">{d.role}</span>
            </div>
            <h2
              className="font-display mt-12 leading-[0.95]"
              style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)" }}
            >
              {d.title}
            </h2>
            <p className="font-serif-text mt-6 max-w-[36ch] text-lg italic leading-[1.45]">
              {d.summary}
            </p>
            <span className="font-ui mt-14 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-[#f55e09]">
              Open
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </section>

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-4 px-6 py-10 text-[11px] uppercase tracking-[0.22em] text-ink/55 md:px-10">
          <span>{company.name} · {company.location}</span>
          <a href={`mailto:${company.email}`} className="hover:text-[#f55e09]">
            {company.email}
          </a>
        </div>
      </footer>
    </main>
  );
}
