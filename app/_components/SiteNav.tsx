"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BulbMark } from "@/app/_components/BulbMark";
import { useVariant } from "@/app/_components/useVariant";
import { nav } from "@/lib/copy";

// Shared site nav used on every inner page. Sits on the dark ground as a
// translucent surface panel with a hairline underline: a clickable bulb
// glyph, mono links that ignite on hover, and a Home link that returns to
// whichever homepage the visitor entered through.
//
// `tone` is kept for call-site compatibility; the whole site is lit-dark
// now, so both tones resolve to the same charcoal treatment.
export function SiteNav({
  tone: _tone = "ink",
  onBulb,
  bulbBlown = false,
  hideHomeLink = false,
}: {
  tone?: "ink" | "light";
  onBulb?: () => void;
  bulbBlown?: boolean;
  hideHomeLink?: boolean;
}) {
  const variant = useVariant();
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const homeHref = variant === "room" ? "/room" : "/session";

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ground/85 backdrop-blur supports-[backdrop-filter]:bg-ground/70">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4 md:px-10 md:py-5">
        <Link
          href={homeHref}
          className="group flex items-center gap-3 text-text"
          aria-label="Illuminate Learning, home"
        >
          <BulbMark
            tone="light"
            size={24}
            onClick={onBulb}
            blown={bulbBlown}
            ariaLabel="Illuminate"
            title={
              bulbBlown ? "Ouch." : "It does something. Easy on the clicks."
            }
          />
          <span className="font-display ignite-text text-xl tracking-tight">
            Illuminate
          </span>
        </Link>

        <nav className="hidden items-center gap-7 font-mono text-[12.5px] text-text-muted md:flex">
          {nav.links
            .filter((l) => !(hideHomeLink && l.href === "/"))
            .map((l) => {
              const href = l.href === "/" ? homeHref : l.href;
              const active =
                l.href === "/"
                  ? pathname === "/session" || pathname === "/room"
                  : pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={href}
                  className={`ignite-text ${active ? "text-brand-orange" : ""}`}
                >
                  {l.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={nav.primaryCta.href}
            className="btn btn-primary btn-sm ignite"
          >
            {nav.primaryCta.label}
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav-mobile"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="ignite inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline text-text md:hidden"
          >
            <span aria-hidden className="text-base leading-none">
              {menuOpen ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile panel — simple stacked list, no flourish. */}
      <div
        id="site-nav-mobile"
        hidden={!menuOpen}
        className="border-t border-hairline md:hidden"
      >
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-6 py-4 text-text">
          {nav.links.map((l) => {
            const href = l.href === "/" ? homeHref : l.href;
            return (
              <Link
                key={l.label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="ignite-text rounded-md py-2 font-mono text-[13px]"
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
