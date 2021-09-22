const IMPORT_META_ENV_NAME = "__IMPORT_META_ENV";
const IMPORT_META_HOT_NAME = "__IMPORT_META_HOT";

function getImportMetaPropPath({ path, property, t }) {
  const isImportMeta =
    t.isIdentifier(path.node.meta, { name: "import" }) &&
    t.isIdentifier(path.node.property, { name: "meta" });

  const isImportMetaProp =
    isImportMeta &&
    t.isMemberExpression(path.parent, { object: path.node }) &&
    t.isIdentifier(path.parent.property, { name: property });

  return isImportMetaProp ? path.parentPath : undefined;
}

function getImportMetaPropAssignmentPath({ path, property, t }) {
  const importMetaEnvPath = getImportMetaPropPath({ path, property, t });
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

function replaceImportMetaUsageWithVariable({ property, identifier, path, t }) {
  const importMetaPropPath = getImportMetaPropPath({ path, property, t });
  if (importMetaPropPath !== undefined) {
    importMetaPropPath.replaceWith(identifier);
  }
}

function replaceImportMetaAssignmentWithVariable({
  property,
  identifier,
  path,
  t,
}) {
  const importMetaEnvAssignmentPath = getImportMetaPropAssignmentPath({
    property,
    path,
    t,
  });
  if (importMetaEnvAssignmentPath !== undefined) {
    const { right } = importMetaEnvAssignmentPath.node;
    const importMetaEnvDeclaration = t.variableDeclaration("const", [
      t.variableDeclarator(identifier, right),
    ]);
    importMetaEnvAssignmentPath.parentPath.replaceWith(
      importMetaEnvDeclaration
    );
  }
}

/** @param {babelCore} options */
function viteMetaTransformPlugin({ types: t }) {
  const IMPORT_META_ENV_IDENTIFIER = t.identifier(IMPORT_META_ENV_NAME);
  const IMPORT_META_HOT_IDENTIFIER = t.identifier(IMPORT_META_HOT_NAME);
  /** @type {PluginObj} */
  const plugin = {
    name: "vite-meta",
    visitor: {
      MetaProperty(path) {
        replaceImportMetaAssignmentWithVariable({
          property: "env",
          identifier: IMPORT_META_ENV_IDENTIFIER,
          path,
          t,
        });
        replaceImportMetaUsageWithVariable({
          property: "env",
          identifier: IMPORT_META_ENV_IDENTIFIER,
          path,
          t,
        });

        replaceImportMetaAssignmentWithVariable({
          property: "hot",
          identifier: IMPORT_META_HOT_IDENTIFIER,
          path,
          t,
        });
        replaceImportMetaUsageWithVariable({
          property: "hot",
          identifier: IMPORT_META_HOT_IDENTIFIER,
          path,
          t,
        });
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
