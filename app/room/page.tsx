import type { Metadata } from "next";
import { RoomPage } from "./RoomPage";
import { roomMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: roomMeta.title,
  description: roomMeta.description,
};

export default function Page() {
  return <RoomPage />;
}
