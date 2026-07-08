import Link from "next/link";
import type { Metadata } from "next";
import { company } from "@/lib/copy";

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
    <main className="font-sans min-h-dvh bg-ground text-text">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-[1400px] items-baseline justify-between px-6 py-8 md:px-10 md:py-10">
          <span className="font-display text-xl tracking-tight">
            Illuminate
          </span>
          <span className="font-mono text-[11px] tracking-[0.04em] text-text-muted">
            Two homepage directions · {company.location}
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="light-pool"
          style={{ top: "-40%", left: "10%", width: "60%", height: "160%" }}
        />
        <div className="relative mx-auto max-w-[1400px] px-6 pt-20 pb-12 md:px-10 md:pt-28">
          <p className="label">the organising idea</p>
          <h1
            className="font-display mt-6 max-w-[16ch] leading-[0.92]"
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
          >
            You are in the <span className="text-brand-orange">room.</span>
          </h1>
          <p className="mt-10 max-w-[58ch] text-lg leading-[1.6] text-text/80 md:text-xl">
            Both directions recreate the feeling of sitting in on a live
            Illuminate training session. Real footage and real faces, the same
            story, interpreted at two different levels of risk.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] divide-y divide-hairline border-y border-hairline md:grid-cols-2 md:divide-x md:divide-y-0">
        {directions.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group relative block bg-ground p-10 transition-colors hover:bg-surface md:p-14"
          >
            <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.04em] text-text-muted">
              <span>{d.label}</span>
              <span className="text-brand-orange">{d.role}</span>
            </div>
            <h2
              className="font-display mt-12 leading-[0.98]"
              style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)" }}
            >
              {d.title}
            </h2>
            <p className="mt-6 max-w-[36ch] text-lg leading-[1.6] text-text/75">
              {d.summary}
            </p>
            <span className="mt-14 inline-flex items-center gap-3 font-mono text-[12px] text-brand-orange">
              Open
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-4 px-6 py-10 font-mono text-[11px] tracking-[0.04em] text-text-muted md:px-10">
          <span>
            {company.name} · {company.location}
          </span>
          <a
            href={`mailto:${company.email}`}
            className="ignite-text hover:text-brand-orange"
          >
            {company.email}
          </a>
        </div>
      </footer>
    </main>
  );
}
