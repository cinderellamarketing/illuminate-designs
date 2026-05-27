import type { Metadata } from "next";
import { ProofPage } from "./ProofPage";
import { proofMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: proofMeta.title,
  description: proofMeta.description,
};

export default function Page() {
  return <ProofPage />;
}
