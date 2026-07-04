import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.7.11",
        port: "5002",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mohosin5004.binarybards.online",

        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.50",
        port: "4009",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.50",
        port: "4009",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'mymaps.usercontent.google.com',
        pathname: '/hostedimage/**',
      }
    ],
  },
};

export default nextConfig;
