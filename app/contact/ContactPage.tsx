"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { company, contact } from "@/lib/copy";

export function ContactPage() {
  return (
    <main className="font-ui min-h-dvh bg-paper text-ink">
      <SiteNav />

      <PageHero
        eyebrow="Contact"
        headline={
          <>
            Tell us what your team{" "}
            <em className="italic text-[#f55e09]">is stuck on.</em>
          </>
        }
        body={contact.body}
      />

      <FormSection />

      <SiteFooter />
    </main>
  );
}

function FormSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [sent, setSent] = useState(false);

  // We don't have a backend on the review build. The form opens a
  // mailto: link with the collected fields so Jen can still see real
  // submissions land.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const companyField = String(fd.get("company") ?? "").trim();
    const stuck = String(fd.get("stuck") ?? "").trim();
    const subject = encodeURIComponent(
      `New enquiry from ${name || "the contact form"}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Work email: ${email}`,
        `Company: ${companyField}`,
        "",
        "What you are stuck on:",
        stuck,
      ].join("\n"),
    );
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section
      ref={ref}
      className="relative border-t border-ink/10 bg-paper py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
            >
              No pitch.{" "}
              <em className="italic text-[#f55e09]">Just tell us.</em>
            </motion.h2>
            <p className="font-serif-text mt-8 max-w-[40ch] text-lg italic leading-[1.4] text-ink/75">
              {contact.bookingLine}
            </p>
            <p className="mt-4 text-sm leading-[1.5] text-ink/60">
              Prefer email? <a
                href={`mailto:${company.email}`}
                className="ignite-text text-[#f55e09] underline decoration-[#f55e09]/40 decoration-2 underline-offset-4"
              >
                {company.email}
              </a>
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-7 grid gap-6 rounded-sm border border-ink/15 bg-paper/60 p-6 md:p-10"
            aria-live="polite"
          >
            {contact.fields.map((field) => (
              <label key={field.name} className="flex flex-col gap-2">
                <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink/55">
                  {field.label}
                  {field.required ? "" : " · optional"}
                </span>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    rows={5}
                    placeholder={"placeholder" in field ? String(field.placeholder ?? "") : ""}
                    className="ignite font-serif-text rounded-sm border border-ink/20 bg-paper/80 px-4 py-3 text-base italic leading-[1.45] text-ink placeholder:text-ink/40 focus:border-[#f55e09] focus:outline-none"
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    placeholder={"placeholder" in field ? String(field.placeholder ?? "") : ""}
                    className="ignite font-ui rounded-sm border border-ink/20 bg-paper/80 px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-[#f55e09] focus:outline-none"
                  />
                )}
              </label>
            ))}

            <div className="mt-2 flex flex-wrap items-center gap-5">
              <button
                type="submit"
                className="ignite inline-flex items-center gap-3 rounded-full bg-[#f55e09] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#d24f06]"
              >
                {contact.primaryCta.label}
                <span aria-hidden>→</span>
              </button>
              {sent && (
                <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#f55e09]">
                  Email window opening. If it didn't, we are at {company.email}.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
