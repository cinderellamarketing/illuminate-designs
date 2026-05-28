"use client";

import { useEffect } from "react";

// Root-mounted: writes a friendly console greeting once per session.
// Quiet, brief, and dependent on nothing else, so it always fires
// even if a route component's own effects are misbehaving.
//
// Lives at the body root via the layout. The Konami / bulb-pop /
// lights-toggle eggs are wired separately in their own components.
const GREETED_KEY = "illuminate_console_greeted";

const ASCII_BULB = [
  "      .---.      ",
  "     /     \\     ",
  "    |  *_*  |    ",
  "     \\     /     ",
  "      |   |      ",
  "      |___|      ",
].join("\n");

export function SiteEggs() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Once per browser session so we don't spam on every route change.
    try {
      if (window.sessionStorage.getItem(GREETED_KEY) === "1") return;
      window.sessionStorage.setItem(GREETED_KEY, "1");
    } catch {
      // Storage unavailable. Fall through and greet anyway. Worst case
      // the visitor gets the greeting on every reload, which is fine.
    }

    try {
      const brand =
        "padding:2px 6px; background:#f55e09; color:#fff; font:600 12px/1 'Hanken Grotesk', sans-serif; border-radius:3px";
      const muted =
        "color:#9a8b73; font:13px/1.45 'Hanken Grotesk', sans-serif";
      const amber =
        "color:#f9a71d; font:13px/1.45 'Hanken Grotesk', sans-serif";

      // Group keeps the cluster collapsible if the visitor finds it noisy.
      console.groupCollapsed(
        "%cIlluminate%c  hello you, lovely lurker.",
        brand,
        muted,
      );
      console.log("%c" + ASCII_BULB, amber);
      console.log(
        "%cThere is a bulb in the nav. It does something.\n" +
          "Press %cL%c to drop the lights. The cursor will sort you out.\n" +
          "If you remember the Konami code, give it a try on either homepage.",
        muted,
        amber,
        muted,
      );
      console.groupEnd();
    } catch {
      // Console unavailable in some sandboxed environments. Nothing to
      // do but move on.
    }
  }, []);

  return null;
}
