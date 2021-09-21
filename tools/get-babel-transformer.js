const { default: BT } = require("babel-jest");

/**
 * @param {GetOptions} options
 */
export function getBabelTransformer({
  inputSourceMap,
}) {
  const babelTransformer = BT.createTransformer({
    inputSourceMap,
    babelrc: false,
  });
  return babelTransformer;
}

/**
 * @typedef {import('@babel/core').TransformOptions} TransformOptions
 * @typedef {import('@jest/transform').SyncTransformer} SyncTransformer
 * @typedef {{
 *  inputSourceMap: TransformOptions['inputSourceMap'],
 *  rootPath: string,
 * }} GetOptions
 */
