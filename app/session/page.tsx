import type { Metadata } from "next";
import { SessionPage } from "./SessionPage";
import { sessionMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: sessionMeta.title,
  description: sessionMeta.description,
};

export default function Page() {
  return <SessionPage />;
}
