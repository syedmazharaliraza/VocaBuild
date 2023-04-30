module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.entry = {
        content: "./src/services/content.js",
        background: "./src/services/background.js",
        main: paths.appIndexJs,
      };
      webpackConfig.output = {
        ...webpackConfig.output,
        filename: "static/js/[name].js",
      };
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        runtimeChunk: false,
      };
      return webpackConfig;
    },
  },
};
