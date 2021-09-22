const { resolve: resolvePath } = require("path");
const { createSyncFn } = require("synckit");
const { log } = require("./file-logger.js");
const { getBabelTransformer } = require("./get-babel-transformer.js");

const transformSync = createSyncFn(resolvePath(__dirname, "./vite-worker.js"));

/** @type { import('@jest/transform').SyncTransformer } */
const transformer = {
  canInstrument: true,
  process(src, filename, options) {
    log({
      event: "pre transform",
      src,
      filename,
    });
    const step1 = transformSync(filename);
    if (!step1.ok) {
      throw step1.error;
    }
    const babelTransformer = getBabelTransformer({
      inputSourceMap: step1.value.map,
      rootPath: options.config.rootDir,
    });
    log({ step1 });
    const step2 = babelTransformer.process(step1.value.code, filename, options);
    log({ step2 });
    return step2;
  },
};
module.exports = transformer;
