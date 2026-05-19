import {
  Fraunces,
  Public_Sans,
  Bricolage_Grotesque,
  Instrument_Serif,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

export const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const allFontVariables = [
  fraunces.variable,
  publicSans.variable,
  bricolage.variable,
  instrumentSerif.variable,
  ibmPlexMono.variable,
  ibmPlexSans.variable,
].join(" ");
