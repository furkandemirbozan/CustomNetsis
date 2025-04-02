/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v2/:path*',
        destination: 'http://172.16.20.230:7171/api/v2/:path*',
      },
    ]
  },
};

module.exports = nextConfig; 