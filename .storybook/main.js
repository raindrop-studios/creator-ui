module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  "webpackFinal": webpackConfig => {
    webpackConfig.resolve.fallback = {
      ...(webpackConfig.resolve.fallback || {}),
      assert: require.resolve("assert/"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      fs: false,
    };
    return webpackConfig
  }
}