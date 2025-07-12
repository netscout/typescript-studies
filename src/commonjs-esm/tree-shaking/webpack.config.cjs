// webpack.config.js
const path = require("path");

module.exports = {
  mode: "production", // tree-shaking을 포함한 최적화 활성화
  entry: {
    "commonjs-bundle": "./commonjs-consumer.cjs",
    "esm-bundle": "./esm-consumer.mjs",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  optimization: {
    usedExports: true, // tree-shaking 활성화
    sideEffects: false,
  },
  resolve: {
    extensions: [".js", ".mjs"],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: "javascript/esm",
      },
    ],
  },
};
