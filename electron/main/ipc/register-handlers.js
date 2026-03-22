const { ipcMain } = require('electron')
const channels = require('../../ipc/channels.json')

function ok(data) {
  return { ok: true, data }
}

function fail(message) {
  return { ok: false, error: message }
}

function register(channel, handler, logger) {
  ipcMain.handle(channel, async (_event, payload) => {
    try {
      const result = await handler(payload)
      return ok(result)
    } catch (error) {
      logger.error(`IPC handler failed: ${channel}`, error)
      return fail(error instanceof Error ? error.message : 'Unknown IPC failure')
    }
  })
}

function registerIpcHandlers({ app, runtimeConfig, logger }) {
  register(channels.app.getMeta, async () => {
    return {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      mode: runtimeConfig.isDev ? 'development' : 'production',
      processVersions: {
        electron: process.versions.electron,
        chrome: process.versions.chrome,
        node: process.versions.node
      }
    }
  }, logger)

  register(channels.system.healthCheck, async () => {
    const memoryUsage = process.memoryUsage()

    return {
      status: 'ok',
      checkedAt: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      pid: process.pid,
      memory: {
        rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024)
      }
    }
  }, logger)
}

module.exports = {
  registerIpcHandlers
}
