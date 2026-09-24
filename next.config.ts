import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server hydrate when opened from another device on the LAN
  // (e.g. testing the auditor mobile flow on a phone) instead of localhost.
  allowedDevOrigins: ['192.168.31.172'],
};

export default nextConfig;
