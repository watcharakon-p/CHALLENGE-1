import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE,
  },
};

export default nextConfig;
