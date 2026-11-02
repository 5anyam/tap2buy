import type { NextConfig } from "next";

const STYLE_SLUGS = "oxfords-derbies|loafers|monk-straps|boots|sandals";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms.tap2buy.in" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cms.caishenunited.com" },
    ],
  },
  reactStrictMode: true,

  // Temporary (307) so these paths stay free to reuse as the catalogue grows.
  async redirects() {
    return [
      { source: "/shop", destination: "/collections", permanent: false },
      { source: "/sale", destination: "/collections", permanent: false },
      { source: "/shop/:slug", destination: "/category/:slug", permanent: false },
      { source: "/category/footwear", destination: "/collections", permanent: false },
      { source: "/category/shoes", destination: "/collections", permanent: false },
      { source: "/category/sleeper", destination: "/collections?style=sandals", permanent: false },
      { source: "/category/cup", destination: "/category/home-kitchen", permanent: false },
      { source: `/category/:style(${STYLE_SLUGS})`, destination: "/collections?style=:style", permanent: false },
    ];
  },
};

export default nextConfig;
