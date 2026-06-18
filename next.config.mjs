/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'backend.alchemyserv.com',
  //       port: '',
  //     },
  //   ],
  // },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
