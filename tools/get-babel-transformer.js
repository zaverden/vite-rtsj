const { default: BT } = require("babel-jest");
const { viteMetaTransformPlugin } = require("./transform-vite-meta");

/**
 * @param {GetOptions} options
 */
function getBabelTransformer({ inputSourceMap, rootPath }) {
  const babelTransformer = BT.createTransformer({
    inputSourceMap,
    configFile: false,
    babelrc: false,
    plugins: [
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          alias: {
            "": rootPath,
          },
        },
      ],
      [require.resolve("@babel/plugin-transform-modules-commonjs"), {}],
      [require.resolve("babel-plugin-transform-import-meta"), {}],
      viteMetaTransformPlugin,
    ],
  });
  return babelTransformer;
}

module.exports = {
  getBabelTransformer,
};

/**
 * @typedef {import('@babel/core').TransformOptions} TransformOptions
 * @typedef {import('@jest/transform').SyncTransformer} SyncTransformer
 * @typedef {{
 *  inputSourceMap: TransformOptions['inputSourceMap'],
 *  rootPath: string,
 * }} GetOptions
 */
