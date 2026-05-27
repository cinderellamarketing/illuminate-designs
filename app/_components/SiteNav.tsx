"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BulbMark } from "@/app/_components/BulbMark";
import { useVariant } from "@/app/_components/useVariant";
import { nav } from "@/lib/copy";

// Shared site nav used on every inner page. Calmer than the homepage
// hero nav, but carries the same characters: a clickable bulb glyph,
// ignite hovers, and a Home link that returns to whichever homepage
// the visitor entered through.
//
// `tone` chooses between the cream-on-ink (light) and ink-on-cream
// (dark text on light page) palettes. Inner pages use "ink" by default.
export function SiteNav({
  tone = "ink",
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
  const isInk = tone === "ink";

  const colourBase = isInk ? "text-ink" : "text-paper";
  const colourMuted = isInk ? "text-ink/70" : "text-paper/75";
  const colourLine = isInk ? "border-ink/10" : "border-paper/15";
  // Tailwind only sees fully-formed class strings in source, so spell
  // out both backgrounds rather than interpolating into one variable.
  const colourPanel = isInk
    ? "bg-paper/95 supports-[backdrop-filter]:bg-paper/75"
    : "bg-ink/95 supports-[backdrop-filter]:bg-ink/75";

  return (
    <header
      className={`sticky top-0 z-40 border-b ${colourLine} ${colourPanel} backdrop-blur`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4 md:px-10 md:py-5">
        <Link
          href={homeHref}
          className={`group flex items-center gap-3 ${colourBase}`}
          aria-label="Illuminate Learning, home"
        >
          <BulbMark
            tone={isInk ? "ink" : "light"}
            size={24}
            onClick={onBulb}
            blown={bulbBlown}
            ariaLabel="Illuminate"
            title={
              bulbBlown
                ? "Ouch."
                : "It does something. Easy on the clicks."
            }
          />
          <span className="font-display ignite-text text-2xl italic tracking-tight">
            Illuminate
          </span>
        </Link>

        <nav
          className={`hidden items-center gap-7 text-[12px] uppercase tracking-[0.18em] ${colourMuted} md:flex`}
        >
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
                  className={`ignite-text ${
                    active ? "text-[#f55e09]" : ""
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={nav.primaryCta.href}
            className="ignite font-ui inline-flex items-center gap-2 rounded-full bg-[#f55e09] px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
          >
            {nav.primaryCta.label}
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav-mobile"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className={`ignite font-ui inline-flex md:hidden h-10 w-10 items-center justify-center rounded-full border ${
              isInk ? "border-ink/15" : "border-paper/15"
            } ${colourBase}`}
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
        className={`md:hidden border-t ${colourLine}`}
      >
        <nav
          className={`mx-auto flex max-w-[1400px] flex-col gap-1 px-6 py-4 ${colourBase}`}
        >
          {nav.links.map((l) => {
            const href = l.href === "/" ? homeHref : l.href;
            return (
              <Link
                key={l.label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="ignite-text rounded-md py-2 text-[13px] uppercase tracking-[0.18em]"
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
