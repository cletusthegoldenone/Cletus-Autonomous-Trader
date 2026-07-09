/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
<<<<<<< HEAD
  eslint: {
    // ESLint is run separately; ignore during builds to avoid version conflicts
    ignoreDuringBuilds: true,
=======
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    turbo: {
      rules: {
        '*.scss': {
          loaders: ['sass-loader'],
          as: '*.css',
        },
      },
    },
>>>>>>> origin/main
  },
};

module.exports = nextConfig;
