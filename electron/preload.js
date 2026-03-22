const { contextBridge, ipcRenderer } = require('electron')
const channels = require('./ipc/channels.json')

const shellApi = Object.freeze({
  isElectron: true,
  platform: process.platform,
  getAppMeta() {
    return ipcRenderer.invoke(channels.app.getMeta)
  },
  healthCheck() {
    return ipcRenderer.invoke(channels.system.healthCheck)
  }
})

contextBridge.exposeInMainWorld('appShell', shellApi)
