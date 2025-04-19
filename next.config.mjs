/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "hiyori-backpack.s3.us-west-2.amazonaws.com",
      },
    ],
      domains: ['cafepilao.vtexassets.com'],
    
  },
  serverExternalPackages: ["@aws-sdk/client-s3", "sharp"], // nova forma correta
};

export default nextConfig;
