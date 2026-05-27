import Link from "next/link";
import type { Metadata } from "next";
import { company } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Lights are off · 404",
  description: "This page is unlit. Try one of the rooms with a bulb in it.",
};

export default function NotFound() {
  return (
    <main className="font-ui min-h-dvh bg-[#0a0907] text-[#f4ede0]">
      <div className="mx-auto flex min-h-dvh max-w-[1100px] flex-col justify-between px-6 py-10 md:px-10 md:py-14">
        <header className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/60">
          <span className="font-display text-xl italic tracking-tight text-[#f4ede0]">
            Illuminate
          </span>
          <span>Code · 404</span>
        </header>

        <div>
          <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
            Nothing here, sorry
          </p>
          <h1
            className="font-display mt-6 leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)" }}
          >
            <span className="block">The lights</span>
            <span className="block italic text-[#f55e09]">are off.</span>
          </h1>
          <p className="font-serif-text mt-8 max-w-[44ch] text-2xl italic leading-[1.25] text-[#f4ede0]/80">
            We could pretend this is a feature. We will not. The page you were
            after has wandered off or never existed.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/session"
              className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[12px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
            >
              Back to the session
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/room"
              className="ignite-text font-ui text-[12px] uppercase tracking-[0.22em] text-[#f4ede0]/85 underline-offset-4 hover:underline"
            >
              Or step into the room
            </Link>
          </div>
        </div>

        <footer className="text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/55">
          <span>
            {company.name} · {company.location} ·{" "}
            <a href={`mailto:${company.email}`} className="ignite-text hover:text-[#f55e09]">
              {company.email}
            </a>
          </span>
        </footer>
      </div>
    </main>
  );
}
