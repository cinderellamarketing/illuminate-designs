import type { Metadata } from "next";
import { allFontVariables } from "@/lib/fonts";
import { LightTransition } from "@/app/_components/LightTransition";
import { LightsControl } from "@/app/_components/LightsControl";
import { SiteEggs } from "@/app/_components/SiteEggs";
import { VariantSwitcher } from "@/app/_components/VariantSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://illuminate-designs.vercel.app"),
  title: {
    default: "Illuminate Learning: Microsoft Copilot training that sticks",
    template: "%s · Illuminate Learning",
  },
  description:
    "You are in the room. Illuminate Learning runs role-specific Microsoft Copilot training that gets teams to 82% adoption.",
  keywords: [
    "Microsoft Copilot training",
    "AI adoption",
    "sales enablement",
    "Pembrokeshire",
    "Illuminate Learning",
  ],
  authors: [{ name: "Illuminate Learning" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "Illuminate Learning: Microsoft Copilot training that sticks",
    description:
      "You are in the room. Role-specific Copilot training, 82% adoption versus an industry norm of 30%.",
    siteName: "Illuminate Learning",
  },
  twitter: {
    card: "summary_large_image",
    title: "Illuminate Learning",
    description:
      "You are in the room. Microsoft Copilot training that gets teams to 82% adoption.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={allFontVariables}>
      <body className="antialiased">
        {children}
        <LightTransition />
        <LightsControl />
        <VariantSwitcher />
        <SiteEggs />
      </body>
    </html>
  );
}
