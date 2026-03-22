const { BrowserWindow, shell } = require('electron')
const path = require('path')

function createMainWindow(runtimeConfig, logger) {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0a0e17',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, '..', '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true
    }
  })

  attachNavigationPolicy(mainWindow, runtimeConfig, logger)

  if (runtimeConfig.isDev) {
    mainWindow.loadURL(runtimeConfig.rendererUrl)
    if (runtimeConfig.openDevTools) {
      mainWindow.webContents.openDevTools({ mode: 'detach' })
    }
  } else {
    mainWindow.loadFile(runtimeConfig.rendererEntry)
  }

  return mainWindow
}

function attachNavigationPolicy(mainWindow, runtimeConfig, logger) {
  const isTrustedUrl = (url) => {
    if (!url) {
      return false
    }

    if (url.startsWith('file://')) {
      return true
    }

    return runtimeConfig.trustedOrigins.some((origin) => url.startsWith(origin))
  }

  const openExternalIfHttp = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return false
    }

    shell.openExternal(url).catch((error) => {
      logger.error('Failed to open external URL', { url, error })
    })
    return true
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isTrustedUrl(url)) {
      return { action: 'allow' }
    }

    if (!openExternalIfHttp(url)) {
      logger.warn('Blocked non-http popup navigation', { url })
    }

    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isTrustedUrl(url)) {
      return
    }

    event.preventDefault()
    if (!openExternalIfHttp(url)) {
      logger.warn('Blocked non-http in-app navigation', { url })
    }
  })
}

module.exports = {
  createMainWindow
}
