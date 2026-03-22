import { defineStore } from 'pinia'

const MAX_LOG_COUNT = 80

function shellApi() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.appShell || null
}

function now() {
  return new Date().toLocaleTimeString()
}

async function invokeShell(methodName, fallbackValue) {
  const api = shellApi()
  if (!api || typeof api[methodName] !== 'function') {
    return fallbackValue
  }

  const response = await api[methodName]()
  if (!response || typeof response !== 'object' || !response.ok) {
    const message = response && response.error ? response.error : `${methodName} failed`
    throw new Error(message)
  }

  return response.data
}

function fallbackMeta() {
  return {
    name: 'Electron Vue Theme Template',
    version: 'template-dev',
    mode: 'browser',
    platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
    processVersions: {
      electron: 'browser-preview',
      chrome: 'browser-preview',
      node: 'browser-preview'
    }
  }
}

function fallbackHealth() {
  return {
    status: 'degraded',
    checkedAt: new Date().toISOString(),
    uptimeSeconds: 0,
    pid: 0,
    memory: {
      rssMB: 0,
      heapUsedMB: 0
    }
  }
}

export const useAppShellStore = defineStore('app-shell', {
  state: () => ({
    meta: null,
    health: null,
    logs: [],
    error: null,
    loading: false,
    backendEndpoint: 'http://127.0.0.1:3999',
    launchMode: 'standard',
    autoStart: true
  }),
  getters: {
    runtimeLabel(state) {
      if (!state.meta) {
        return '--'
      }
      return `${state.meta.mode} / ${state.meta.platform}`
    },
    healthLabel(state) {
      return state.health ? state.health.status : 'checking'
    },
    healthClass(state) {
      return state.health && state.health.status === 'ok' ? 'status-pill is-success' : 'status-pill is-warning'
    },
    runningInElectron() {
      const api = shellApi()
      return Boolean(api && api.isElectron)
    }
  },
  actions: {
    pushLog(level, message) {
      this.logs.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        level,
        time: now(),
        message
      })
      if (this.logs.length > MAX_LOG_COUNT) {
        this.logs.length = MAX_LOG_COUNT
      }
    },
    clearLogs() {
      this.logs = []
      this.pushLog('info', 'Log buffer cleared')
    },
    async initialize() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.error = null
      this.pushLog('info', 'Initializing runtime panel')

      try {
        const [meta, health] = await Promise.all([
          invokeShell('getAppMeta', fallbackMeta()),
          invokeShell('healthCheck', fallbackHealth())
        ])
        this.meta = meta
        this.health = health
        this.pushLog('info', `Runtime connected: ${meta.name}@${meta.version}`)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown init error'
        this.error = message
        this.pushLog('error', `Initialization failed: ${message}`)
      } finally {
        this.loading = false
      }
    },
    async refreshHealth({ silent = false } = {}) {
      try {
        const health = await invokeShell('healthCheck', fallbackHealth())
        this.health = health
        if (!silent) {
          this.pushLog('info', `Health updated at ${health.checkedAt}`)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown health-check error'
        this.error = message
        this.pushLog('warn', `Health check failed: ${message}`)
      }
    }
  }
})
