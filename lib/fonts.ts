import { Archivo, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";

// Three clear roles, no serif.
//
// Display: Archivo, a confident branded grotesque. Loaded as a variable
// font with the width axis so headlines can be set heavy and wide in
// globals.css (see .font-display).
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

// Body and UI. Kept from before — it reads well once the serif and cream
// are gone.
export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

// Utility: labels, the stat readout and any data. IBM Plex Mono is not a
// variable font, so weights are requested explicitly.
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const allFontVariables = [
  archivo.variable,
  hanken.variable,
  plexMono.variable,
].join(" ");
