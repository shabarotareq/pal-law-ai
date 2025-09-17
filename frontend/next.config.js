/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // إعدادات Webpack
  webpack: (config, { isServer }) => {
    // تعطيل بعض الحزم على جانب العميل
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }

    return config;
  },

  // إعدادات تجريبية
  experimental: {
    serverComponentsExternalPackages: ["gzip-size"],
  },
};

module.exports = nextConfig;
