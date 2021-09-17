const { resolve: resolvePath } = require("path");
const { createSyncFn } = require("synckit");
const { default: BT } = require("babel-jest");
const { log } = require("./file-logger.js");

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
    step1.value.code = fixImports(step1.value.code);
    const babelTransformer = BT.createTransformer({
      inputSourceMap: step1.value.map,
    });
    const step2 = babelTransformer.process(step1.value.code, filename, options);
    log({ step1, step2 });
    return step2;
  },
};
module.exports = transformer;

// TODO: looks like there are more edge cases
// https://github.com/sodatea/vite-jest/blob/6cb71219d13dfced3dbb0a2a6df3e437d80d9849/packages/vite-jest/index.js#L41-L68
function fixImports(code) {
  // import {} from '/src/utils/add.ts'
  // resolve it from project root
  return code.replace(/from \"\//g, `from "${options.config.rootDir}/`);
}
