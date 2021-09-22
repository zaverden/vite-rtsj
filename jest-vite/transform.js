const { resolve: resolvePath } = require("path");
const { createSyncFn } = require("synckit");
const { getBabelTransformer } = require("./babel/get-babel-transformer.js");

const transformSync = createSyncFn(
  resolvePath(__dirname, "./vite/vite-worker.js")
);
function matchFile(filename, reStrings) {
  for (const reStr of reStrings) {
    const re = new RegExp(reStr);
    if (re.test(filename)) {
      return true;
    }
  }
  return false;
}

/** @type { import('@jest/transform').SyncTransformer } */
const transformer = {
  canInstrument: true,
  process(src, filename, options) {
    const { printTransformationFor = [] } = options.transformerConfig ?? {};
    const shouldPrint = matchFile(filename, printTransformationFor);
    if (shouldPrint) {
      console.warn({
        stage: "original",
        filename,
        src,
      });
    }

    const step1 = transformSync(filename);
    if (!step1.ok) {
      throw step1.error;
    }

    if (shouldPrint) {
      console.warn({
        stage: "vite",
        filename,
        src: step1.value.code,
      });
    }

    const babelTransformer = getBabelTransformer({
      inputSourceMap: step1.value.map,
      rootPath: options.config.rootDir,
      base: step1.config.base,
    });
    const step2 = babelTransformer.process(step1.value.code, filename, options);
    if (shouldPrint) {
      console.warn({
        stage: "babel",
        filename,
        src: step2.code,
      });
    }

    return step2;
  },
};
module.exports = transformer;
