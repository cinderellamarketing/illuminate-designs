import type { Metadata } from "next";
import { SessionPage } from "./session/SessionPage";
import { sessionMeta } from "@/lib/copy";

// The homepage. Renders the session experience directly at the site root —
// the same SessionPage component that used to live at /session, reused rather
// than duplicated. The old two-direction chooser is gone; /session now 308s
// back here (see next.config.ts) and this "/" is the site's canonical home.
export const metadata: Metadata = {
  title: sessionMeta.title,
  description: sessionMeta.description,
  alternates: { canonical: "/" },
};

export default function Page() {
  return <SessionPage />;
}
