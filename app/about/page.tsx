import type { Metadata } from "next";
import { AboutPage } from "./AboutPage";
import { aboutMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
};

export default function Page() {
  return <AboutPage />;
}
