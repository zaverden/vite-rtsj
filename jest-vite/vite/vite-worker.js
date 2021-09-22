const { createServer } = require("vite");
const { runAsWorker } = require("synckit");

(async () => {
  const viteServer = await createServer({
    server: {
      hmr: false,
      middlewareMode: true,
    },
  });

  runAsWorker(async (url, options) => {
    try {
      const r = await viteServer.transformRequest(url, options);
      return { ok: true, value: r };
    } catch (error) {
      return {
        ok: false,
        error: {
          ...error,
          name: error.name,
          stack: error.stack,
        },
      };
    }
  });
})();
