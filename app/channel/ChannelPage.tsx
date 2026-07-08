"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PageHero } from "@/app/_components/PageHero";
import { SessionVideo } from "@/app/_components/SessionVideo";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteNav } from "@/app/_components/SiteNav";
import { channel } from "@/lib/copy";
import { channelVideos, toClip, type ChannelVideo } from "./videos";

// /channel — Edd's page. It speaks to the layer above MSPs: Microsoft
// distributors and resellers (the TD SYNNEX kind of relationship) who sell
// Copilot and the wider Microsoft stack to MSPs and end customers. Its job
// is to make the case for Edd's channel and sales enablement, distinct from
// /for-msps, which speaks to MSPs directly.
//
// Section shapes are deliberately varied: a split heading over a numbered
// list, a three-fact band with no heading, a framed video moment, a proof
// split holding labelled placeholders, and a closing statement with a CTA.
// A mono kicker sits only on the hero, not on every section.
export function ChannelPage() {
  return (
    <main className="font-sans min-h-dvh bg-ground text-text">
      <SiteNav />

      <PageHero
        eyebrow={channel.hero.eyebrow}
        headline={
          <>
            {channel.hero.headlineLead}{" "}
            <span className="text-brand-orange">
              {channel.hero.headlineAccent}
            </span>
          </>
        }
        body={channel.hero.body}
      />

      <Enablement />
      <Credibility />
      <EddVideo />
      <Proof />
      <Close />

      <SiteFooter />
    </main>
  );
}

/* ---------------- Enablement ---------------- */
// Split heading on the left, a numbered editorial list of the four strands
// on the right. Open rows divided by hairlines, so it reads as an index and
// not a grid of identical cards. The conditional funding note sits quietly
// beneath.

function Enablement() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { enablement } = channel;
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-hairline bg-surface py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : undefined}
              transition={{ duration: 0.7 }}
              className="h-1 w-12 origin-left bg-brand-orange"
            />
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="font-display mt-7 max-w-[16ch] leading-[0.99]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
            >
              {enablement.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-6 max-w-[46ch] text-lg leading-[1.6] text-text/75 md:text-xl"
            >
              {enablement.lead}
            </motion.p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ol className="flex flex-col divide-y divide-hairline border-t border-hairline">
              {enablement.strands.map((s, i) => (
                <motion.li
                  key={s.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.08 }}
                  className="py-8 first:pt-10"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[12px] tabular-nums text-brand-amber">
                      0{i + 1}
                    </span>
                    <h3
                      className="font-display leading-[1.06]"
                      style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}
                    >
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-[60ch] text-base leading-[1.6] text-text/75 md:pl-8 md:text-lg">
                    {s.body}
                  </p>
                </motion.li>
              ))}
            </ol>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="mt-8 max-w-[60ch] font-mono text-[12px] leading-[1.7] text-text-muted md:pl-8"
            >
              {enablement.funding}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Credibility ---------------- */
// Three facts, no section heading and no kicker. Each carries a small mono
// data label above a plain declarative. Stated as fact, not embellished.

function Credibility() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-hairline bg-ground py-24 md:py-32"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-20%", left: "28%", width: "50%", height: "150%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {channel.credibility.facts.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="border-t border-hairline pt-6"
            >
              <p className="font-mono text-[11px] tracking-[0.06em] text-brand-amber">
                {f.label}
              </p>
              <p
                className="font-display mt-4 leading-[1.08]"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)" }}
              >
                {f.fact}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Edd on video ---------------- */
// The framed video moment. edd_intro leads as the feature frame beside a
// short heading; edd_sales_enablement follows as a secondary frame. Both use
// the managed SessionVideo treatment: poster-first, lazy-loaded, muted, one
// clip at a time. Empty slots paint the styled placeholder until footage
// lands (see ./videos.ts).

function EddVideo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-hairline bg-surface-2 py-28 md:py-40"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-10%", right: "-8%", left: "auto", width: "56%", height: "130%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8 }}
              className="font-display leading-[0.98]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
            >
              {channel.video.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mt-6 max-w-[42ch] text-lg leading-[1.6] text-text/75"
            >
              {channel.video.body}
            </motion.p>
          </div>

          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <ChannelFrame
                video={channelVideos.edd_intro}
                reelNo={1}
                poolStyle={{
                  top: "-16%",
                  left: "-10%",
                  width: "120%",
                  height: "134%",
                }}
              />
              <FrameCaption label={channelVideos.edd_intro.label} />
            </motion.div>
          </div>
        </div>

        {/* Secondary clip, offset under the feature. */}
        <div className="mt-12 grid md:mt-16 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="md:col-span-6 md:col-start-7"
          >
            <ChannelFrame
              video={channelVideos.edd_sales_enablement}
              reelNo={2}
              poolStyle={{
                top: "-16%",
                right: "-10%",
                left: "auto",
                width: "120%",
                height: "134%",
              }}
            />
            <FrameCaption label={channelVideos.edd_sales_enablement.label} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Proof ---------------- */
// The TD SYNNEX partnership and Sabs endorsement, held as labelled
// placeholders. edd_partnership sits beside them as the framed clip. No
// invented quote: the wording waits on Jen and TD SYNNEX.

function Proof() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { proof } = channel;
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-hairline bg-ground py-28 md:py-40"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-14%", left: "2%", width: "54%", height: "140%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9 }}
            className="md:col-span-6"
          >
            <ChannelFrame
              video={channelVideos.edd_partnership}
              reelNo={3}
              poolStyle={{
                top: "-16%",
                left: "-10%",
                width: "122%",
                height: "134%",
              }}
            />
            <FrameCaption label={channelVideos.edd_partnership.label} />
          </motion.div>

          <div className="md:col-span-5 md:col-start-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display leading-[1.0]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              {proof.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="mt-6 max-w-[46ch] text-lg leading-[1.6] text-text/75"
            >
              {proof.body}
            </motion.p>

            <motion.figure
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="mt-8 m-0 border-l border-hairline pl-5"
            >
              <blockquote
                className="font-display leading-[1.15] text-text-muted"
                style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)" }}
              >
                {proof.endorsementPlaceholder}
              </blockquote>
              <figcaption className="mt-5 font-mono text-[12px] leading-[1.7] text-text-muted">
                {proof.partnershipPlaceholder}
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Close ---------------- */
// One statement and one primary CTA through to /contact. Nav and footer
// carry the visitor on into the rest of the site.

function Close() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const { close } = channel;
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-hairline bg-surface-2 py-28 md:py-40"
    >
      <div
        aria-hidden
        className="light-pool"
        style={{ top: "-22%", left: "12%", width: "64%", height: "150%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.85 }}
          className="font-display max-w-[18ch] leading-[1.0]"
          style={{ fontSize: "clamp(2.5rem, 6.4vw, 5.5rem)" }}
        >
          {close.headlineLead}{" "}
          <span className="text-brand-orange">{close.headlineAccent}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-8 max-w-[52ch] text-lg leading-[1.6] text-text/75 md:text-xl"
        >
          {close.body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-10"
        >
          <Link href={close.cta.href} className="btn btn-primary btn-lg ignite">
            <span aria-hidden className="btn-switch" />
            {close.cta.label}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Shared primitives ---------------- */

// A framed clip on a raised charcoal surface with a warm light pool behind,
// matching the /room treatment. The managed SessionVideo streams HLS from
// the slot's source, plays one clip at a time, lazy-loads near the viewport
// and stays muted. While a slot is empty it paints the styled placeholder,
// so the frame reads as a video to follow and the page works today.
function ChannelFrame({
  video,
  poolStyle,
  className = "",
  reelNo = 1,
}: {
  video: ChannelVideo;
  poolStyle?: React.CSSProperties;
  className?: string;
  reelNo?: number;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden
        className="light-pool"
        style={
          poolStyle ?? { top: "-18%", left: "-12%", width: "124%", height: "136%" }
        }
      />
      <figure className="relative m-0 rounded-2xl border border-hairline bg-surface-2 p-2 shadow-[0_50px_130px_-50px_rgba(0,0,0,0.95)] md:p-2.5">
        <div
          className="relative overflow-hidden rounded-xl bg-[#0b0a08]"
          style={{ aspectRatio: "16 / 9" }}
        >
          <SessionVideo
            clip={toClip(video)}
            variant="fill"
            managed
            reelNo={reelNo}
            className="h-full w-full"
            label={video.label}
          />
        </div>
      </figure>
    </div>
  );
}

// Small mono caption beneath a frame, flagging the slot as pending footage.
function FrameCaption({ label }: { label: string }) {
  return (
    <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-text-muted">
      {label} · clip to follow
    </p>
  );
}
