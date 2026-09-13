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

  // The store currently sells footwear only. Old multi-category URLs land on the collection.
  // Temporary (307) so these paths can be reused if more categories return later.
  async redirects() {
    return [
      { source: "/shop", destination: "/collections", permanent: false },
      { source: "/sale", destination: "/collections", permanent: false },
      ...["category", "shop"].flatMap((base) => [
        { source: `/${base}/sleeper`, destination: "/collections?style=sandals", permanent: false },
        { source: `/${base}/:style(${STYLE_SLUGS})`, destination: "/collections?style=:style", permanent: false },
        { source: `/${base}/:slug`, destination: "/collections", permanent: false },
      ]),
    ];
  },
};

export default nextConfig;
