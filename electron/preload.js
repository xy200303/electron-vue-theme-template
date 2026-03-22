const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('appShell', {
  platform: process.platform
})
