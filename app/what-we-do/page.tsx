import type { Metadata } from "next";
import { WhatWeDoPage } from "./WhatWeDoPage";
import { whatWeDoMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: whatWeDoMeta.title,
  description: whatWeDoMeta.description,
};

export default function Page() {
  return <WhatWeDoPage />;
}
