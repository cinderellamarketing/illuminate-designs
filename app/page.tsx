"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The root URL has no canonical homepage during the review phase, so
// route the visitor to whichever variant they last saw. Default to
// /session for first-time arrivals. The variant flag itself is set by
// /session and /room on mount; we just read it here.
export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    let target: "/session" | "/room" = "/session";
    try {
      const v = window.sessionStorage.getItem("illuminate_variant");
      if (v === "room") target = "/room";
    } catch {}
    router.replace(target);
  }, [router]);

  return (
    <main className="font-ui flex min-h-dvh items-center justify-center bg-paper text-ink">
      <p className="font-display text-2xl italic tracking-tight">
        Switching the lights on.
      </p>
    </main>
  );
}
