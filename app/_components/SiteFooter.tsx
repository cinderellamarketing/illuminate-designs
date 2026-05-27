"use client";

import Link from "next/link";
import { StudioSpotlight } from "@/app/_components/StudioSpotlight";
import { useVariant } from "@/app/_components/useVariant";
import { company, footer, nav } from "@/lib/copy";

// Shared site footer used on every page. Carries the cursor-tracked
// wordmark spotlight (untouched), the navigation columns from the copy
// file, and the signoff + small print microcopy. The Home link inside
// the columns routes back to whichever homepage the visitor entered
// through.
export function SiteFooter() {
  const variant = useVariant();
  const homeHref = variant === "room" ? "/room" : "/session";

  return (
    <footer>
      <div className="bg-[#0b0a08]">
        <div className="mx-auto max-w-[1500px] px-6 pt-20 pb-10 md:px-10 md:pt-24 md:pb-14">
          <StudioSpotlight />
        </div>
      </div>

      <div className="bg-[#0a0907] text-[#f4ede0]">
        <div className="mx-auto max-w-[1500px] px-6 py-14 md:px-10 md:py-20">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-display text-2xl italic tracking-tight text-[#f4ede0]">
                {footer.brand}
              </p>
              <p className="font-serif-text mt-4 max-w-[36ch] text-xl italic leading-[1.35] text-[#f4ede0]/80">
                {footer.tagline}
              </p>
              <p className="mt-8 text-sm leading-[1.5] text-[#f4ede0]/60">
                {footer.signoff}
              </p>
              <p className="mt-2 text-sm italic leading-[1.5] text-[#f4ede0]/55">
                {footer.smallPrint}
              </p>
            </div>

            <nav
              aria-label="Footer"
              className="md:col-span-4 md:col-start-7 grid grid-cols-2 gap-x-6 gap-y-3 text-[12px] uppercase tracking-[0.2em] text-[#f4ede0]/70"
            >
              <Link href={homeHref} className="ignite-text">
                Home
              </Link>
              {footer.columns.map((c) => (
                <Link key={c.label} href={c.href} className="ignite-text">
                  {c.label}
                </Link>
              ))}
            </nav>

            <div className="md:col-span-3 md:col-start-10 flex flex-col gap-3 text-sm leading-[1.5] text-[#f4ede0]/70">
              <a
                href={`mailto:${company.email}`}
                className="ignite-text font-serif-text text-xl italic text-[#f4ede0]"
              >
                {company.email}
              </a>
              <Link
                href={nav.primaryCta.href}
                className="ignite mt-2 inline-flex items-center gap-2 self-start rounded-full bg-[#f55e09] px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
              >
                {nav.primaryCta.label}
              </Link>
            </div>
          </div>

          <div className="mt-12 border-t border-[#f4ede0]/10 pt-6 text-[11px] uppercase tracking-[0.22em] text-[#f4ede0]/45">
            © {new Date().getFullYear()} {company.name}. {company.location}.
          </div>
        </div>
      </div>
    </footer>
  );
}
