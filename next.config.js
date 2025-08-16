/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail the Vercel build on lint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // (Optional) unblock build if you have TS errors too
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
