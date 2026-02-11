/** @type {import('next').NextConfig} */
const nextConfig = {
//   experimental: {
//     turbo: {
//       resolveAlias: {
//         'next/server.js': 'next/server',
//         'next/navigation.js': 'next/navigation',
//         'next/headers.js': 'next/headers',
//       },
//     },
//  },
  reactStrictMode: true,
  transpilePackages: ["@pdfme/generator", "@pdfme/common", "@pdfme/schemas"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "dhalparagpbuscket.s3.us-east-2.amazonaws.com",
        pathname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false }
    return config
  },
};

export default nextConfig;
