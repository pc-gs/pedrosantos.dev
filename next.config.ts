import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/projects/:slug", destination: "/work/:slug", permanent: true },
      { source: "/favicon.ico", destination: "/icon.svg", permanent: true },
      // Essays live inside the log now; /blog/:slug pages stay where they are.
      { source: "/blog", destination: "/log#essays", permanent: true },
      // Retired projects.
      { source: "/work/select-script", destination: "/work", permanent: true },
      { source: "/work/ai-tree", destination: "/work", permanent: true },
      { source: "/work/electron-draw", destination: "/work", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seeklogo.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
