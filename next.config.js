/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname); // Allows "@/components" to map correctly
    return config;
  },
};

module.exports = nextConfig;
