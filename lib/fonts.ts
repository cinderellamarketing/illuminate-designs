import { Newsreader, Hanken_Grotesk } from "next/font/google";

// Editorial serif for headlines and big statements.
// Variable axis "opsz" lets us flip into display optical sizing at large sizes.
export const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

// Clean modern grotesque for body, labels and UI.
export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const allFontVariables = [newsreader.variable, hanken.variable].join(" ");
