import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remove experimental config that might cause issues
  // experimental: {
  //   serverComponentsExternalPackages: ["next-auth"],
  // },
  // Fix for AWS Amplify build issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("next-auth");
    }
    
    config.module.rules.push({
      test: /\.node$/,
      use: "file-loader",
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spacce-dev-store.s3.eu-west-1.amazonaws.com",
        pathname: "/**",
      },
    ],
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
            value: "unsafe-none", // 🔧 RELAXED to avoid blocking
          },
        ],
      },
    ];
  },
};

export default withNextVideo(nextConfig);
