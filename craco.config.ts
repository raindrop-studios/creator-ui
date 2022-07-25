import path from "path";

const { loaderByName, addBeforeLoader } = require("@craco/craco");

module.exports = {
  webpack: {
    configure: (webpackConfig: any) => {
      // Add polyfills for node libs
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        assert: require.resolve("assert/"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        fs: false,
      };
      // Use ts-loader for @raindrops-protocol/raindrops
      const tsLoader = {
        loader: require.resolve("ts-loader"),
        test: /\.ts$/,
        include: [
            path.resolve("node_modules", "@raindrops-protocol/raindrops")
        ],
        options: { transpileOnly: true },
        // exclude: /node_modules/,
      };

      addBeforeLoader(webpackConfig, loaderByName("babel-loader"), tsLoader);

      return webpackConfig;
    },
  },
};

export {};
