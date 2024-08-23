import * as babel from '@babel/core'

function isValidHookName(name: string) {
  // Complex selectors that include other selectors (e.g. :not(), :is(),
  // :where(), :has()) are not supported because they require a full CSS
  // parser to extract the individual selectors.

  return (
    // Pseudo-Classes
    /^:(?:hover|focus|active|disabled|visited|link|checked|enabled|target|read-only|read-write|default|required|optional|valid|invalid|in-range|out-of-range|placeholder-shown|indeterminate|first-child|last-child|nth-child\(\d+\)|nth-last-child\(\d+\)|nth-of-type\(\d+\)|nth-last-of-type\(\d+\)|first-of-type|last-of-type|only-child|only-of-type|empty|root|not\([^)]+\)|lang\([^)]+\)|dir\([^)]+\)|any-link|scope|focus-within|focus-visible)$/.test(
      name
    ) ||
    // Pseudo-elements
    /^::?(?:before|after|first-letter|first-line|placeholder|selection|marker|backdrop|file-selector-button|part\([^)]+\)|webkit-scrollbar|webkit-scrollbar-thumb|webkit-scrollbar-track|webkit-scrollbar-button|webkit-input-placeholder|moz-placeholder|ms-input-placeholder|webkit-search-cancel-button|webkit-search-decoration|ms-expand|moz-range-track|moz-range-thumb|webkit-progress-bar|webkit-progress-value|webkit-meter-bar|webkit-meter-even-less-good-value|webkit-meter-inner-element|webkit-meter-optimum-value|webkit-meter-suboptimum-value|ms-browse)$/.test(
      name
    ) ||
    // Media Queries
    /^@media\s.+$/.test(name) ||
    // Feature Queries
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
