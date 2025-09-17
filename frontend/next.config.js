/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // إعدادات Webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // تعطيل وحدات Node.js على العميل
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

      // تجاهل الحزم التي تعتمد على Node.js مثل gzip-size
      config.externals = config.externals || [];
      config.externals.push("gzip-size");
    }

    return config;
  },

  // إعدادات تجريبية
  experimental: {
    serverComponentsExternalPackages: ["gzip-size"],
  },
};

module.exports = nextConfig;
