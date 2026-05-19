import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://illuminate-designs.vercel.app";
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified, priority: 1 },
    { url: `${base}/editorial`, lastModified, priority: 0.8 },
    { url: `${base}/studio`, lastModified, priority: 0.8 },
    { url: `${base}/cinema`, lastModified, priority: 0.8 },
  ];
}
