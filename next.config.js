/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['example.com', 'youtube.com', 'i.ytimg.com', 'v5.airtableusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    // Fix for Node.js modules in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig