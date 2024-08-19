const path = require('node:path')

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

const ALIASES = {
  '@stylexjs/stylex': path.join(__dirname, 'src/lib/stylex'),
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  return context.resolveRequest(
    context,
    ALIASES[moduleName] ?? moduleName,
    platform
  )
}

module.exports = config
