/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  // Environment variables that should be available at runtime
  env: {
    // NextAuth v5 - Frontend URL (where your Next.js app is hosted)
    AUTH_URL: process.env.AUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    // Backend API URL (where your authentication API is hosted)
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spacce-dev-store.s3.eu-west-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: "file-loader",
    });
    return config;
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
