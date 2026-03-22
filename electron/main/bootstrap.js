const { app, BrowserWindow } = require('electron')
const { resolveRuntimeConfig } = require('./config/runtime-config')
const { registerIpcHandlers } = require('./ipc/register-handlers')
const { createLogger } = require('./utils/logger')
const { createMainWindow } = require('./windows/main-window')

const logger = createLogger('bootstrap')

function focusPrimaryWindow() {
  const primaryWindow = BrowserWindow.getAllWindows()[0]
  if (!primaryWindow) {
    return
  }

  if (primaryWindow.isMinimized()) {
    primaryWindow.restore()
  }
  primaryWindow.focus()
}

function attachProcessGuards() {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception in main process', error)
  })

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection in main process', reason)
  })

  app.on('render-process-gone', (_event, webContents, details) => {
    logger.warn('Renderer process gone', {
      reason: details.reason,
      exitCode: details.exitCode,
      url: webContents.getURL()
    })
  })
}

function bootstrapApplication() {
  const runtimeConfig = resolveRuntimeConfig()

  if (!app.requestSingleInstanceLock()) {
    logger.warn('Another instance is already running, exiting')
    app.quit()
    return
  }

  app.on('second-instance', () => {
    logger.info('Detected second instance attempt, focusing existing window')
    focusPrimaryWindow()
  })

  attachProcessGuards()

  app.whenReady().then(() => {
    registerIpcHandlers({ app, runtimeConfig, logger })
    createMainWindow(runtimeConfig, logger)

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow(runtimeConfig, logger)
      }
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

module.exports = {
  bootstrapApplication
}
