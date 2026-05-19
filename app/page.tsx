import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Three design directions",
  description:
    "Three homepage directions for Illuminate Learning. Pick the one that fits the brand voice.",
};

const variants = [
  {
    href: "/editorial",
    label: "Editorial",
    tag: "Pentagram × Monocle",
    summary:
      "Refined editorial. Asymmetric grids on cream paper, restrained motion, an oversized italic Fraunces voice.",
    palette: ["#f6efe2", "#15110d", "#f55e09"],
    font: "var(--font-fraunces)",
    bg: "#f6efe2",
    ink: "#15110d",
  },
  {
    href: "/studio",
    label: "Studio",
    tag: "Linear × Stripe",
    summary:
      "Modern studio. Mixed cream and obsidian sections, a blend-mode cursor, magnetic CTAs, a hero spotlight.",
    palette: ["#f4ede0", "#0c0a08", "#f55e09"],
    font: "var(--font-bricolage)",
    bg: "#0c0a08",
    ink: "#f4ede0",
  },
  {
    href: "/cinema",
    label: "Cinema",
    tag: "Agency portfolio",
    summary:
      "Cinematic. Near-black canvas where a cursor torch reveals the words. Aggressive on purpose.",
    palette: ["#050505", "#f5f0e8", "#f55e09"],
    font: "var(--font-instrument)",
    bg: "#050505",
    ink: "#f5f0e8",
  },
] as const;

export default function IndexPage() {
  return (
    <main
      className="min-h-dvh bg-paper-editorial text-ink-editorial"
      style={{ fontFamily: "var(--font-public-sans)" }}
    >
      <header className="px-6 md:px-10 pt-10 pb-6 flex items-baseline justify-between border-b border-ink-editorial/10">
        <div className="flex items-baseline gap-3">
          <span
            className="text-2xl tracking-tight"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
              fontStyle: "italic",
            }}
          >
            Illuminate
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-ink-editorial/60">
            Design study
          </span>
        </div>
        <span className="text-xs uppercase tracking-[0.18em] text-ink-editorial/60">
          Three directions
        </span>
      </header>

      <section className="px-6 md:px-10 pt-16 pb-10 max-w-5xl">
        <h1
          className="text-5xl md:text-7xl leading-[0.95] tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontVariationSettings: '"opsz" 144, "SOFT" 70',
          }}
        >
          Three homepage directions for{" "}
          <em
            className="text-brand-orange"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1' }}
          >
            Illuminate
          </em>
          .
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-editorial/70">
          Same eight sections. Same copy. Three very different voices. The
          cursor-tracked spotlight wordmark sits in every footer, but it is
          interpreted differently in each.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-24 grid gap-8 md:grid-cols-3">
        {variants.map((v, i) => (
          <Link
            key={v.href}
            href={v.href}
            className="group block"
            aria-label={`Open the ${v.label} variant`}
          >
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-sm transition-transform duration-500 group-hover:-translate-y-1"
              style={{ backgroundColor: v.bg, color: v.ink }}
            >
              {/* Thumbnail composition */}
              <div
                className="absolute inset-0 p-6 flex flex-col justify-between"
                style={{ fontFamily: v.font }}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] opacity-70">
                  <span>0{i + 1}</span>
                  <span>{v.tag}</span>
                </div>

                <div className="space-y-3">
                  <div
                    className="text-5xl leading-[0.9]"
                    style={
                      v.label === "Cinema" || v.label === "Editorial"
                        ? { fontStyle: "italic" }
                        : undefined
                    }
                  >
                    {v.label === "Studio" ? (
                      <span>
                        Built for the way
                        <br />
                        <em
                          style={{
                            fontFamily: "var(--font-instrument)",
                            color: "#f55e09",
                          }}
                        >
                          work
                        </em>{" "}
                        happens.
                      </span>
                    ) : v.label === "Cinema" ? (
                      <span style={{ color: v.ink, opacity: 0.18 }}>
                        Training
                        <br />
                        built for
                        <br />
                        <span style={{ color: "#f55e09", opacity: 1 }}>
                          the way
                        </span>
                      </span>
                    ) : (
                      <span>
                        Training built
                        <br />
                        for the way{" "}
                        <em style={{ color: "#f55e09" }}>work</em>
                        <br />
                        actually happens.
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {v.palette.map((c) => (
                      <span
                        key={c}
                        className="h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-sm opacity-80 max-w-[18ch]">{v.summary}</p>
                  <span
                    className="text-xs uppercase tracking-[0.2em] opacity-80 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  >
                    Open →
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-lg" style={{ fontFamily: v.font }}>
                /{v.href.replace("/", "")}
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-ink-editorial/50">
                {v.tag}
              </span>
            </div>
          </Link>
        ))}
      </section>

      <footer className="px-6 md:px-10 py-10 border-t border-ink-editorial/10 flex flex-wrap items-baseline justify-between gap-4 text-xs uppercase tracking-[0.18em] text-ink-editorial/60">
        <span>Illuminate Learning · Design study · 2026</span>
        <span>British English throughout</span>
      </footer>
    </main>
  );
}
