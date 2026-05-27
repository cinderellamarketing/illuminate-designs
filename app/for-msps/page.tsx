import type { Metadata } from "next";
import { ForMspsPage } from "./ForMspsPage";
import { forMspsMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: forMspsMeta.title,
  description: forMspsMeta.description,
};

export default function Page() {
  return <ForMspsPage />;
}
