"use client";

import Link from "next/link";
import { useState } from "react";
import { company } from "@/lib/copy";
import { BulbMark } from "@/app/_components/BulbMark";

// 404 with a working wall switch. Visitor flips it; the room lights up,
// the page is revealed, and a way home appears. The site-wide L hotkey
// and corner switch still work, but this is the in-page invitation.
export function NotFoundDark() {
  const [lit, setLit] = useState(false);

  return (
    <main
      className={`font-ui relative min-h-dvh overflow-hidden transition-colors duration-500 ${
        lit
          ? "bg-[#0e0c08] text-[#f4ede0]"
          : "bg-[#040302] text-[#f4ede0]/55"
      }`}
    >
      {/* Warm room glow once the switch is flipped. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: lit ? 1 : 0,
          background:
            "radial-gradient(60% 60% at 50% 35%, rgba(249,167,29,0.18) 0%, rgba(245,94,9,0.04) 55%, rgba(11,10,8,0) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-[1100px] flex-col justify-between px-6 py-10 md:px-10 md:py-14">
        <header className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-current/60">
          <span className="font-display text-xl italic tracking-tight">
            Illuminate
          </span>
          <span>Code · 404</span>
        </header>

        <div>
          <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f9a71d]">
            {lit ? "Found you" : "Power's out, sorry"}
          </p>
          <h1
            className="font-display mt-6 leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)" }}
          >
            <span className="block">The lights</span>
            <span
              className={`block italic transition-colors duration-500 ${
                lit ? "text-[#f9a71d]" : "text-[#f55e09]"
              }`}
            >
              {lit ? "are on." : "are off."}
            </span>
          </h1>
          <p
            className="font-serif-text mt-8 max-w-[46ch] text-2xl italic leading-[1.25] transition-opacity duration-500"
            style={{ opacity: lit ? 1 : 0.55 }}
          >
            {lit
              ? "Welcome back. The page you were after still does not exist. The way home, however, very much does."
              : "We could pretend this is a feature. We will not. There is a switch on the wall, though. Try that."}
          </p>

          {/* The wall switch. Big enough to invite a flip; small enough
              to feel like a real one in the corner of a dark room. */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <WallSwitch lit={lit} onToggle={() => setLit((v) => !v)} />
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-current/65">
              {lit ? "Have a poke around." : "Pull the cord."}
            </p>
          </div>

          {/* Way home, only revealed once the lights are on. */}
          <div
            className={`mt-12 flex flex-wrap items-center gap-5 transition-all duration-500 ${
              lit
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0"
            }`}
            aria-hidden={!lit}
          >
            <Link
              href="/session"
              className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[12px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
            >
              Back into the session
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/room"
              className="ignite-text font-ui text-[12px] uppercase tracking-[0.22em] underline-offset-4 hover:underline"
            >
              Or step into the room
            </Link>
          </div>
        </div>

        <footer className="text-[11px] uppercase tracking-[0.22em] text-current/55">
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

function WallSwitch({
  lit,
  onToggle,
}: {
  lit: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={lit}
      aria-label={lit ? "Turn the room lights off" : "Turn the room lights on"}
      className="group relative inline-flex items-center gap-4 rounded-md border border-[#f4ede0]/15 bg-[#0b0a08] px-4 py-3 text-left transition hover:border-[#f55e09]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f55e09]"
    >
      <span className="relative inline-flex h-12 w-7 items-center justify-center rounded-sm border border-[#f4ede0]/25 bg-[#0a0907]">
        {/* The toggle paddle. Slides up when lit. */}
        <span
          aria-hidden
          className={`absolute left-1 right-1 h-5 rounded-sm transition-all duration-300 ${
            lit
              ? "top-1 bg-[#f9a71d] shadow-[0_0_12px_rgba(249,167,29,0.7)]"
              : "top-6 bg-[#211a12]"
          }`}
        />
      </span>
      <span className="flex flex-col">
        <span className="font-ui text-[10px] uppercase tracking-[0.28em] text-[#f4ede0]/60">
          Wall switch
        </span>
        <span className="font-ui mt-1 text-[12px] uppercase tracking-[0.22em] text-[#f4ede0]">
          {lit ? "On" : "Off"}
        </span>
      </span>
      <span className="ml-2">
        <BulbMark tone="light" size={20} />
      </span>
    </button>
  );
}
