"use client";

// Brief warm radial pulse fired when the Konami code lands, just before
// the maze opens. Reduced motion gets a soft static glow instead of the
// animated swell (handled in globals.css). Shared by both homepages.
export function KonamiFlourish({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className="konami-flourish"
      data-active={active ? "true" : "false"}
    />
  );
}
