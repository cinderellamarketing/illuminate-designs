import type { Metadata } from "next";
import { ContactPage } from "./ContactPage";
import { contactMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
};

export default function Page() {
  return <ContactPage />;
}
