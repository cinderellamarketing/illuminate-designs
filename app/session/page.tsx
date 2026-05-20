import type { Metadata } from "next";
import { SessionPage } from "./SessionPage";

export const metadata: Metadata = {
  title: "In the room — Microsoft Copilot training",
  description:
    "Step inside a live Illuminate Learning session. 82% Copilot adoption, role-specific training, follow-up that sticks.",
};

export default function Page() {
  return <SessionPage />;
}
