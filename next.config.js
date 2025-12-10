/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  // Meningkatkan batas ukuran body untuk upload
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

module.exports = nextConfig;
