/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'pokedex.veraserg.io' }]
  }
}

module.exports = nextConfig