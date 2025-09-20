const { when, whenDev } = require("@craco/craco");
const webpack = require("webpack"); // أضف هذا السطر

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // إصلاح مشكلة وحدات Node.js في المتصفح
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        buffer: require.resolve("buffer/"),
        util: require.resolve("util/"),
        url: require.resolve("url/"),
        querystring: require.resolve("querystring-es3/"),
      };

      // إضافة plugins إضافية
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      ];

      // تجاهل تحذيرات معينة
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /Module not found: Error: Can't resolve/,
        /Critical dependency: require function is used/,
        /Can't resolve 'fs'/,
        /Can't resolve 'path'/,
      ];

      return webpackConfig;
    },
  },

  // إعدادات Jest للاختبارات
  jest: {
    configure: (jestConfig) => {
      jestConfig.moduleNameMapper = {
        ...jestConfig.moduleNameMapper,
        "^fs$": require.resolve("./src/mocks/fsMock.js"),
        "^path$": require.resolve("./src/mocks/pathMock.js"),
        "^crypto$": require.resolve("./src/mocks/cryptoMock.js"),
      };
      return jestConfig;
    },
  },

  // إعدادات التطوير
  devServer: {
    hot: true,
    open: true,
    port: 3000,
  },
};
