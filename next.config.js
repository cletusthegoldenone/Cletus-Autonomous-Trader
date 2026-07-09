/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // ESLint is run separately; ignore during builds to avoid version conflicts
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
