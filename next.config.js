/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
};
module.exports = nextConfig;
