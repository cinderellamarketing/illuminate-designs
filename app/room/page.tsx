import type { Metadata } from "next";
import { RoomPage } from "./RoomPage";

export const metadata: Metadata = {
  title: "The room — a session, scrolled",
  description:
    "Land mid-session. A cinematic, scroll-driven walk through how Illuminate Learning gets teams to 82% Microsoft Copilot adoption.",
};

export default function Page() {
  return <RoomPage />;
}
