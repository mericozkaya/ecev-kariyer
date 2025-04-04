/** @type {import('next').NextConfig} */

const nextConfig = {
  // Vercel build sırasında ESLint hatası olsa bile devam etsin
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Gerekirse burada basePath veya env ekleyebilirsin
  reactStrictMode: true,
};

export default nextConfig;
