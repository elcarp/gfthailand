/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },

  images: {
    domains: ['assets.aceternity.com'],
  },
}

export default nextConfig
