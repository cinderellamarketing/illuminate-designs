import type { Metadata } from "next";
import { InsightsPage } from "./InsightsPage";
import { insightsMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: insightsMeta.title,
  description: insightsMeta.description,
};

export default function Page() {
  return <InsightsPage />;
}
