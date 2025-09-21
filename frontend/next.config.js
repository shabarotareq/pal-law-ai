/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // إعدادات Webpack مخصصة
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // تجاوز الحزم الخاصة بالسيرفر عند البندل للعميل
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

      // تجاهل حزمة gzip-size أثناء البندل للعميل
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^gzip-size$/,
        })
      );
    }

    return config;
  },

  // تحسين الأداء وتقليل التحذيرات في البناء
  experimental: {
    webpackBuildWorker: true,
  },

  // حل مشكلة serverComponentsExternalPackages في Next.js 15+
  serverExternalPackages: ["gzip-size"],

  // تجاوز تحذيرات ESLint أثناء البناء
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ضبط TypeScript
  typescript: {
    ignoreBuildErrors: false, // اجعل true لتجاوز أخطاء TypeScript أثناء البناء إذا أردت
  },
};

module.exports = nextConfig;
