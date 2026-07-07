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
      className={`font-sans relative min-h-dvh overflow-hidden text-text transition-colors duration-500 ${
        lit ? "bg-ground" : "bg-[#050403]"
      }`}
    >
      {/* Warm room glow once the switch is flipped. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: lit ? 1 : 0,
          background:
            "radial-gradient(60% 60% at 50% 35%, rgba(249,167,29,0.18) 0%, rgba(245,94,9,0.04) 55%, rgba(13,11,9,0) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-[1100px] flex-col justify-between px-6 py-10 md:px-10 md:py-14">
        <header className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.04em] text-text-muted">
          <span className="font-display text-lg tracking-tight text-text">
            Illuminate
          </span>
          <span>Code · 404</span>
        </header>

        <div>
          <p className="label uppercase tracking-[0.12em] text-brand-amber">
            {lit ? "Found you" : "Power's out, sorry"}
          </p>
          <h1
            className="font-display mt-6 leading-[0.94]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)" }}
          >
            <span className="block">The lights</span>
            <span
              className={`block transition-colors duration-500 ${
                lit ? "text-brand-amber" : "text-brand-orange"
              }`}
            >
              {lit ? "are on." : "are off."}
            </span>
          </h1>
          <p
            className="mt-8 max-w-[48ch] text-lg leading-[1.6] text-text/80 transition-opacity duration-500 md:text-xl"
            style={{ opacity: lit ? 1 : 0.55 }}
          >
            {lit
              ? "Welcome back. The page you were after still does not exist. The way home, however, very much does."
              : "We could pretend this is a feature. We will not. There is a switch on the wall, though. Try that."}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <WallSwitch lit={lit} onToggle={() => setLit((v) => !v)} />
            <p className="font-mono text-[12px] text-text-muted">
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
            <Link href="/session" className="btn btn-primary btn-lg ignite">
              <span aria-hidden className="btn-switch" />
              Back into the session
            </Link>
            <Link href="/room" className="btn btn-secondary btn-lg ignite">
              Or step into the room
            </Link>
          </div>
        </div>

        <footer className="font-mono text-[11px] tracking-[0.04em] text-text-muted">
          <span>
            {company.name} · {company.location} ·{" "}
            <a
              href={`mailto:${company.email}`}
              className="ignite-text hover:text-brand-orange"
            >
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
      className="group relative inline-flex items-center gap-4 rounded-lg border border-hairline bg-surface px-4 py-3 text-left transition hover:border-[#f55e09]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f55e09]"
    >
      <span className="relative inline-flex h-12 w-7 items-center justify-center rounded-sm border border-hairline bg-surface-2">
        {/* The toggle paddle. Slides up when lit. */}
        <span
          aria-hidden
          className={`absolute left-1 right-1 h-5 rounded-sm transition-all duration-300 ${
            lit
              ? "top-1 bg-brand-amber shadow-[0_0_12px_rgba(249,167,29,0.7)]"
              : "top-6 bg-[#211a12]"
          }`}
        />
      </span>
      <span className="flex flex-col">
        <span className="font-mono text-[10px] tracking-[0.06em] text-text-muted">
          Wall switch
        </span>
        <span className="font-mono mt-1 text-[12px] tracking-[0.04em] text-text">
          {lit ? "On" : "Off"}
        </span>
      </span>
      <span className="ml-2">
        <BulbMark tone="light" size={20} />
      </span>
    </button>
  );
}
