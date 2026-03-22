const path = require('path')
const { app } = require('electron')

const DEFAULT_RENDERER_URL = 'http://127.0.0.1:5174'

function normalizeUrl(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function resolveTrustedOrigins(rendererUrl) {
  const trustedOrigins = [rendererUrl]
  const extraTrustedOrigins = process.env.ELECTRON_TRUSTED_ORIGINS

  if (!extraTrustedOrigins) {
    return trustedOrigins
  }

  const values = extraTrustedOrigins
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(normalizeUrl)

  return [...new Set([...trustedOrigins, ...values])]
}

function resolveRuntimeConfig() {
  const isDev = !app.isPackaged
  const rendererUrl = normalizeUrl(process.env.VITE_DEV_SERVER_URL || DEFAULT_RENDERER_URL)
  const rendererEntry = path.join(__dirname, '..', '..', '..', 'dist', 'index.html')

  return {
    isDev,
    rendererUrl,
    rendererEntry,
    openDevTools: process.env.ELECTRON_OPEN_DEVTOOLS === 'true',
    trustedOrigins: resolveTrustedOrigins(rendererUrl)
  }
}

module.exports = {
  resolveRuntimeConfig
}
