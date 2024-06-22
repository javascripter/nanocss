import * as babel from '@babel/core'

function isValidHookName(name: string) {
  return (
    /^:(?:hover|focus|active|disabled|visited|before|after|first-child|last-child|nth-child\(\d+\)|nth-last-child\(\d+\)|not\(.+\)|placeholder|selection|target|focus-within|focus-visible|dir\(.+\)|lang\(.+\)|global|local|where\(.+\))$/.test(
      name
    ) ||
    /^@media\s.+$/.test(name) ||
    /^@supports\s.+$/.test(name)
  )
}

function createExtractHooksBabelPlugin() {
  return {
    visitor: {
      StringLiteral(
        path: babel.NodePath<babel.types.StringLiteral>,
        pass: babel.PluginPass
      ) {
        const metadata = pass.file.metadata as { hooks?: Set<string> }

        if (!metadata.hooks) {
          metadata.hooks = new Set()
        }

        const { node } = path

        if (isValidHookName(node.value)) {
          metadata.hooks.add(node.value)
        }
      },
    },
  }
}

export async function extractHooks(filename: string, source: string) {
  const result = await babel.transformAsync(source, {
    filename,
    babelrc: false,
    cloneInputAst: false,
    parserOpts: {
      plugins: /\.tsx$/.test(filename)
        ? ['typescript', 'jsx', 'decorators']
        : /\.ts?$/.test(filename)
        ? ['typescript', 'decorators']
        : /\.jsx?$/.test(filename)
        ? ['jsx', 'decorators']
        : /\.[cm]?js$/.test(filename)
        ? ['decorators']
        : [],
    },
    plugins: [createExtractHooksBabelPlugin()],
  })

  if (!result || !result.metadata || !('hooks' in result.metadata)) {
    return []
  }

  return [...(result.metadata.hooks as Set<string>)]
}
