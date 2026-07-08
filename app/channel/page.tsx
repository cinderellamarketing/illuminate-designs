import type { Metadata } from "next";
import { ChannelPage } from "./ChannelPage";
import { channelMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: channelMeta.title,
  description: channelMeta.description,
};

export default function Page() {
  return <ChannelPage />;
}
