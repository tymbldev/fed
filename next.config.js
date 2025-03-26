/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // This will allow Next.js to better handle both ESM and CJS modules
    esmExternals: 'loose'
  }
}

module.exports = nextConfig 