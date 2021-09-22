const IMPORT_META_ENV_NAME = "__IMPORT_META_ENV";

function getImportMetaEnvPath(path, t) {
  const isImportMeta =
    t.isIdentifier(path.node.meta, { name: "import" }) &&
    t.isIdentifier(path.node.property, { name: "meta" });

  const isImportMetaEnv =
    isImportMeta &&
    t.isMemberExpression(path.parent, { object: path.node }) &&
    t.isIdentifier(path.parent.property, { name: "env" });

  return isImportMetaEnv ? path.parentPath : undefined;
}

function getImportMetaEnvAssignmentPath(path, t) {
  const importMetaEnvPath = getImportMetaEnvPath(path, t);
  if (importMetaEnvPath === undefined) {
    return undefined;
  }

  const isImportMetaEnvAssignment = t.isAssignmentExpression(
    importMetaEnvPath.parent,
    {
      operator: "=",
      left: importMetaEnvPath.node,
    }
  );

  return isImportMetaEnvAssignment ? path.parentPath.parentPath : undefined;
}

/** @param {babelCore} options */
function viteMetaTransformPlugin({ types: t }) {
  const IMPORT_META_ENV_IDENTIFIER = t.identifier(IMPORT_META_ENV_NAME);
  /** @type {PluginObj} */
  const plugin = {
    name: "vite-meta",
    visitor: {
      MetaProperty(path) {
        const importMetaEnvAssignmentPath = getImportMetaEnvAssignmentPath(
          path,
          t
        );
        if (importMetaEnvAssignmentPath !== undefined) {
          const { right } = importMetaEnvAssignmentPath.node;
          const importMetaEnvDeclaration = t.variableDeclaration("const", [
            t.variableDeclarator(IMPORT_META_ENV_IDENTIFIER, right),
          ]);
          importMetaEnvAssignmentPath.parentPath.replaceWith(
            importMetaEnvDeclaration
          );
        }

        const importMetaEnvPath = getImportMetaEnvPath(path, t);
        if (importMetaEnvPath !== undefined) {
          importMetaEnvPath.replaceWith(IMPORT_META_ENV_IDENTIFIER);
        }
      },
    },
  };
  return plugin;
}

module.exports = {
  viteMetaTransformPlugin,
};

/**
 * @typedef {import('@babel/core')} babelCore
 * @typedef {import('@babel/core').PluginObj} PluginObj
 * @typedef {import('@babel/core').NodePath} NodePath
 * @typedef {import('@babel/types').AssignmentExpression} AssignmentExpression
 */
