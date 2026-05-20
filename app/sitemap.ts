import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://illuminate-designs.vercel.app";
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified, priority: 1 },
    { url: `${base}/session`, lastModified, priority: 0.9 },
    { url: `${base}/room`, lastModified, priority: 0.9 },
  ];
}
