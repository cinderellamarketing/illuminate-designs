import type { Metadata } from "next";
import { NotFoundDark } from "./_components/NotFoundDark";

export const metadata: Metadata = {
  title: "Lights are off · 404",
  description: "This page is unlit. Flip the switch and see what we found instead.",
};

export default function NotFound() {
  return <NotFoundDark />;
}
