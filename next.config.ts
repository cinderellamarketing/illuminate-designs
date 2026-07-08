import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // The session experience is now the homepage at "/". The old /session URL
  // is kept working with a permanent (308) redirect home, so bookmarks and
  // external links never break and search engines cache the move. Redirects
  // are checked before the filesystem, so /session never renders a page.
  async redirects() {
    return [
      {
        source: "/session",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
