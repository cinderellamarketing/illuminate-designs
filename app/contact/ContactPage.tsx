"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { company, contact } from "@/lib/copy";

export function ContactPage() {
  return (
    <main className="font-sans min-h-dvh bg-ground text-text">
      <SiteNav />

      <PageHero
        eyebrow="contact"
        headline={
          <>
            {contact.headline.lead}{" "}
            <span className="text-brand-orange">{contact.headline.accent}</span>
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

  // No backend on the review build. The form opens a mailto: link with the
  // collected fields so Jen can still see real submissions land.
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
      className="relative border-t border-hairline bg-ground py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display leading-[0.98]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
            >
              No pitch.{" "}
              <span className="text-brand-orange">Just tell us.</span>
            </motion.h2>
            <p className="mt-8 max-w-[40ch] text-lg leading-[1.6] text-text/75">
              {contact.bookingLine}
            </p>
            <p className="mt-4 font-mono text-[13px] leading-[1.6] text-text-muted">
              Prefer email?{" "}
              <a
                href={`mailto:${company.email}`}
                className="ignite-text text-brand-orange"
              >
                {company.email}
              </a>
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-7 grid gap-6 rounded-lg border border-hairline bg-surface p-6 md:p-10"
            aria-live="polite"
          >
            {contact.fields.map((field) => (
              <label key={field.name} className="flex flex-col gap-2">
                <span className="label">
                  {field.label}
                  {field.required ? "" : " · optional"}
                </span>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    rows={5}
                    placeholder={
                      "placeholder" in field
                        ? String(field.placeholder ?? "")
                        : ""
                    }
                    className="ignite rounded-md border border-hairline bg-surface-2 px-4 py-3 leading-[1.55] text-text placeholder:text-text-muted focus:border-brand-orange focus:outline-none"
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    placeholder={
                      "placeholder" in field
                        ? String(field.placeholder ?? "")
                        : ""
                    }
                    className="ignite rounded-md border border-hairline bg-surface-2 px-4 py-3 text-text placeholder:text-text-muted focus:border-brand-orange focus:outline-none"
                  />
                )}
              </label>
            ))}

            <div className="mt-2 flex flex-wrap items-center gap-5">
              <button type="submit" className="btn btn-primary btn-lg ignite">
                <span aria-hidden className="btn-switch" />
                {contact.primaryCta.label}
              </button>
              {sent && (
                <span className="font-mono text-[12px] text-brand-amber">
                  Email window opening. If it didn&apos;t, we are at {company.email}.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
