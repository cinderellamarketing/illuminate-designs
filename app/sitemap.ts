import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://illuminate-designs.vercel.app";
  const lastModified = new Date();
  const paths: Array<{ url: string; priority: number }> = [
    { url: "/", priority: 1 },
    { url: "/room", priority: 1 },
    { url: "/what-we-do", priority: 0.8 },
    { url: "/for-msps", priority: 0.8 },
    { url: "/channel", priority: 0.8 },
    { url: "/proof", priority: 0.8 },
    { url: "/about", priority: 0.7 },
    { url: "/insights", priority: 0.7 },
    { url: "/contact", priority: 0.7 },
  ];
  return paths.map((p) => ({
    url: `${base}${p.url}`,
    lastModified,
    priority: p.priority,
  }));
}
