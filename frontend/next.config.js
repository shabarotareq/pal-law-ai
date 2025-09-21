/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // تعطيل مكتبات Node.js على المتصفح
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
        stream: false,
        zlib: false,
      };

      const webpack = require("webpack");

      // تجاهل gzip-size حتى لا يدخل في bundle العميل
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^gzip-size$/,
        })
      );
    }

    return config;
  },

  experimental: {
    // يظل gzip-size متاح فقط للسيرفر
    serverComponentsExternalPackages: ["gzip-size"],
    // تفعيل build worker لتقليل التحذيرات وتحسين الأداء
    webpackBuildWorker: true,
  },
};

module.exports = nextConfig;
