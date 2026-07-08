"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { contact } from "@/lib/copy";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Public Formspree endpoint. Safe to post to straight from the client:
// there is no secret and no server route. An input named exactly "email"
// makes Formspree set reply-to to the sender.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeebwwrd";

// Deliberately loose: we only want a valid-looking address before posting,
// not a strict RFC check that rejects real inboxes.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = { name?: boolean; email?: boolean; message?: boolean };

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
  const ref = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  const f = contact.form;
  const sending = status === "sending";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // Quiet client-side check before we post: name present, a valid-looking
    // email, message present.
    const next: FieldErrors = {
      name: !name,
      email: !EMAIL_RE.test(email),
      message: !message,
    };
    if (next.name || next.email || next.message) {
      setErrors(next);
      const firstBad = next.name ? "name" : next.email ? "email" : "message";
      form
        .querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${firstBad}"]`,
        )
        ?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const onAgain = () => {
    setErrors({});
    setStatus("idle");
    // Return focus into a fresh form so a second enquiry is one keystroke away.
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLTextAreaElement>('[name="message"]')
        ?.focus();
    });
  };

  return (
    <section
      ref={ref}
      data-sent={status === "sent" ? "true" : undefined}
      className="cf-section relative border-t border-hairline bg-ground py-24 md:py-32"
    >
      {/* Warm wash that comes up when the enquiry lands. */}
      <div aria-hidden className="cf-section__warm" />

      <div className="relative z-10 mx-auto w-full max-w-[760px] px-6 md:px-8">
        {status === "sent" ? (
          <Confirmation reduce={reduce} onAgain={onAgain} />
        ) : (
          <motion.form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7 }}
            className="grid gap-10"
          >
            {/* Honeypot. Formspree silently drops any submission that fills
                this, so it stays in the DOM but out of sight and out of the
                tab order and the accessibility tree. */}
            <div className="cf-hp" aria-hidden>
              <label>
                Do not fill this in if you are human
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <input
              type="hidden"
              name="_subject"
              value="New enquiry from the Illuminate site"
            />

            <Field
              hero
              multiline
              id="cf-message"
              name={f.hero.name}
              label={f.hero.label}
              placeholder={f.hero.placeholder}
              required
              error={errors.message ? f.validation.message : undefined}
              disabled={sending}
            />

            <div className="grid gap-10 sm:grid-cols-2">
              <Field
                id="cf-name"
                name={f.name.name}
                label={f.name.label}
                autoComplete="name"
                required
                error={errors.name ? f.validation.name : undefined}
                disabled={sending}
              />
              <Field
                id="cf-email"
                name={f.email.name}
                label={f.email.label}
                type="email"
                autoComplete="email"
                required
                error={errors.email ? f.validation.email : undefined}
                disabled={sending}
              />
            </div>

            <Field
              id="cf-company"
              name={f.company.name}
              label={f.company.label}
              optional={f.company.optional}
              autoComplete="organization"
              disabled={sending}
            />

            <div className="mt-2 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="cf-switch ignite"
                data-state={sending ? "sending" : "idle"}
                disabled={sending}
                aria-busy={sending}
              >
                <span aria-hidden className="cf-switch__track">
                  <span className="cf-switch__paddle" />
                </span>
                <span>{sending ? f.sending : f.send}</span>
              </button>

              <p className="font-mono text-[12px] leading-[1.6] text-text-muted">
                {f.privacy}
              </p>
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="cf-error font-mono text-[13px] leading-[1.6]"
              >
                {f.error.lead}{" "}
                <a
                  href={`mailto:${f.error.email}`}
                  className="ignite-text text-brand-orange"
                >
                  {f.error.email}
                </a>
                .
              </p>
            )}
          </motion.form>
        )}
      </div>
    </section>
  );
}

function Confirmation({
  reduce,
  onAgain,
}: {
  reduce: boolean;
  onAgain: () => void;
}) {
  const s = contact.form.success;
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="label">sent</p>
      <p
        className="font-display mt-5 max-w-[18ch] leading-[1.02]"
        style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}
      >
        {s.heading}{" "}
        <span className="text-brand-orange">{s.body}</span>
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="cf-again ignite-text mt-9 font-mono text-[13px] text-brand-orange"
      >
        {s.again}
      </button>
    </motion.div>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  multiline = false,
  hero = false,
  optional,
  autoComplete,
  required = false,
  error,
  disabled,
}: {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  hero?: boolean;
  optional?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}) {
  const errorId = error ? `${id}-error` : undefined;
  const className = `cf-input${hero ? " cf-input--hero" : ""}`;
  const shared = {
    id,
    name,
    placeholder,
    className,
    disabled,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": errorId,
  } as const;

  return (
    <div className="cf-field">
      <span aria-hidden className="cf-field__pool" />
      <label htmlFor={id} className="cf-field__label label">
        {label}
        {optional && <span className="cf-field__optional"> · {optional}</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}
      {error && (
        <span id={errorId} className="cf-field__error font-mono text-[12px]">
          {error}
        </span>
      )}
    </div>
  );
}
