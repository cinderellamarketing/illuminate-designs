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
  "      .-.  ",
  "     /   \\ ",
  "     \\   / ",
  "      | |  ",
  "      |_|  ",
].join("\n");

const GREETING =
  "\n\nYou're trying to illuminate your knowledge by peeking under the bonnet\n" +
  "of our site. We like that. It's exactly the sort of instinct we look for.\n\n" +
  "You've earned a bit of fun, so here are the hidden bits:\n\n" +
  "  • Click the lightbulb in our logo and take 5. There's a little game in there.\n" +
  "  • Feeling nostalgic? The Konami code still works.\n" +
  "    Up, up, down, down, left, right, left, right, B, A.\n" +
  "  • Press L to turn the lights off and have a look around in the dark.\n\n" +
  "And if you do this for a living, helping people get real use out of the\n" +
  "Microsoft tools they already pay for, we should probably talk.\n" +
  "There's a contact page for exactly that.\n\n" +
  "Now off you pop. The maze is waiting.";

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
      // One log so the bulb's spacing survives. Only the greeting line is
      // styled (brand orange, bold); the rest stays at the console default
      // so it reads on both light and dark consoles.
      console.log(
        ASCII_BULB + "\n\n%cHello, curious one.%c" + GREETING,
        "color:#f55e09;font-weight:700",
        "",
      );
    } catch {
      // Console unavailable in some sandboxed environments. Nothing to
      // do but move on.
    }
  }, []);

  return null;
}
