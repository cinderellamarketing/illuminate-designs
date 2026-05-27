"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVariant, setVariant } from "@/app/_components/useVariant";

// Discreet variant switcher for the review phase. Sits bottom-left,
// opposite the lights switch, and lets Jen flip between the two
// homepages without losing her place on inner pages.
//
// When clicked from an inner page, this updates the stored variant
// flag in place so the in-page Home and logo links resolve to the
// chosen homepage on next interaction.
//
// To be removed once Jen picks a direction.
export function VariantSwitcher() {
  const variant = useVariant();
  const pathname = usePathname() ?? "/";

  const onHomepage = pathname === "/session" || pathname === "/room";
  const alt = variant === "room" ? "session" : "room";
  const altHref = alt === "room" ? "/room" : "/session";

  // On a homepage, the link jumps to the other homepage. On an inner
  // page, the link just updates the stored variant and the user stays
  // put — the next Home click will land on the chosen homepage.
  const handleClick = (e: React.MouseEvent) => {
    if (!onHomepage) {
      e.preventDefault();
      setVariant(alt);
    }
  };

  return (
    <Link
      href={onHomepage ? altHref : pathname}
      onClick={handleClick}
      aria-label={`Switch to the ${alt} homepage`}
      className="variant-switch ignite group"
      title={
        onHomepage
          ? `Jump to /${alt}`
          : `Home will now go to /${alt}`
      }
    >
      <span aria-hidden className="variant-switch__dot" />
      <span aria-hidden className="variant-switch__label">
        Homepage
      </span>
      <span
        aria-hidden
        className="variant-switch__current"
        data-variant={variant}
      >
        /{variant}
      </span>
      <span aria-hidden className="variant-switch__arrow">
        ↔
      </span>
    </Link>
  );
}
