import type { Metadata } from "next";
import { allFontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://illuminate-designs.vercel.app"),
  title: {
    default: "Illuminate Learning — Microsoft Copilot training that sticks",
    template: "%s · Illuminate Learning",
  },
  description:
    "Illuminate Learning trains teams on Microsoft Copilot and AI tools. Role-specific programmes that change behaviour, not just attendance.",
  keywords: [
    "Microsoft Copilot training",
    "AI adoption",
    "sales enablement",
    "MSP training",
    "Illuminate Learning",
  ],
  authors: [{ name: "Illuminate Learning" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "Illuminate Learning — Microsoft Copilot training that sticks",
    description:
      "Role-specific Copilot and AI programmes for sales, technical and adoption teams.",
    siteName: "Illuminate Learning",
  },
  twitter: {
    card: "summary_large_image",
    title: "Illuminate Learning",
    description:
      "Microsoft Copilot training that changes behaviour, not just attendance.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={allFontVariables}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
