"use client";

import Link from "next/link";
import { StudioSpotlight } from "@/app/_components/StudioSpotlight";
import { useVariant } from "@/app/_components/useVariant";
import { company, footer, nav } from "@/lib/copy";

// Shared site footer. Carries the cursor-tracked wordmark spotlight
// (untouched behaviour), the navigation columns from the copy file, and
// the signoff. The Home link routes back to whichever homepage the
// visitor entered through.
export function SiteFooter() {
  const variant = useVariant();
  const homeHref = variant === "room" ? "/room" : "/session";

  return (
    <footer className="border-t border-hairline bg-ground text-text">
      <div className="mx-auto max-w-[1500px] px-6 pt-20 pb-10 md:px-10 md:pt-24 md:pb-14">
        <StudioSpotlight />
      </div>

      <div className="mx-auto max-w-[1500px] px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl tracking-tight text-text">
              {footer.brand}
            </p>
            <p className="mt-4 max-w-[36ch] text-lg leading-[1.5] text-text/80">
              {footer.tagline}
            </p>
            <p className="mt-8 font-mono text-[12px] leading-[1.6] text-text-muted">
              {footer.signoff}
            </p>
            <p className="mt-2 font-mono text-[12px] leading-[1.6] text-text-muted">
              {footer.smallPrint}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="md:col-span-4 md:col-start-7 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[13px] text-text-muted"
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

          <div className="md:col-span-3 md:col-start-10 flex flex-col items-start gap-4">
            <a
              href={`mailto:${company.email}`}
              className="ignite-text font-mono text-[14px] text-text"
            >
              {company.email}
            </a>
            <Link href={nav.primaryCta.href} className="btn btn-primary ignite">
              {nav.primaryCta.label}
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-hairline pt-6 font-mono text-[11px] tracking-[0.02em] text-text-muted">
          © {new Date().getFullYear()} {company.name}. {company.location}.
        </div>
      </div>
    </footer>
  );
}
