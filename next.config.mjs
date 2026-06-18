/** @type {import('next').NextConfig} */
const nextConfig = {
  // Moved to stable top-level key in Next.js 14.2+
  serverExternalPackages: ["@neondatabase/serverless"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
