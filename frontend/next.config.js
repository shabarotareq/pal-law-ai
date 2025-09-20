/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack: (config, { isServer }) => {
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

  // يظل gzip-size متاح فقط للسيرفر
  experimental: {
    serverComponentsExternalPackages: ["gzip-size"],
  },
};

module.exports = nextConfig;
