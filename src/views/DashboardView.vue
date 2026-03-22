<template>
  <section class="dashboard-page">
    <header class="top-bar panel">
      <div class="title-block">
        <h1>Electron Enterprise Starter</h1>
        <p>Simple but structured runtime panel.</p>
      </div>
      <div class="action-row">
        <button class="btn btn-ghost" @click="store.clearLogs">Clear logs</button>
        <button class="btn" :disabled="store.loading" @click="store.refreshHealth()">
          {{ store.loading ? 'Loading...' : 'Refresh health' }}
        </button>
      </div>
    </header>

    <div class="content-grid">
      <main class="main-area panel">
        <div class="section-head section-head-inline">
          <h2>Runtime controls</h2>
          <span :class="store.healthClass">{{ store.healthLabel }}</span>
        </div>

        <div class="field-grid">
          <label class="field">
            <span>Backend endpoint</span>
            <input v-model="store.backendEndpoint" class="input" type="text" />
          </label>
          <label class="field">
            <span>Launch mode</span>
            <select v-model="store.launchMode" class="select">
              <option value="standard">Standard</option>
              <option value="safe">Safe</option>
            </select>
          </label>
        </div>

        <div class="switch-row">
          <span>Auto start</span>
          <button class="switch" :class="{ 'is-on': store.autoStart }" @click="toggleAutoStart">
            <span class="switch-dot"></span>
          </button>
        </div>

        <p v-if="store.error" class="error-text">{{ store.error }}</p>

        <div class="log-area">
          <div v-if="store.logs.length === 0" class="log-empty">No logs yet.</div>
          <div
            v-for="entry in store.logs"
            :key="entry.id"
            class="log-row"
            :class="`level-${entry.level}`"
          >
            [{{ entry.level.toUpperCase() }}] {{ entry.time }} {{ entry.message }}
          </div>
        </div>
      </main>

      <aside class="slide-panel panel">
        <h3>Runtime snapshot</h3>
        <p class="muted">Enterprise baseline: layered main process + secure IPC + store-driven UI.</p>
        <ul class="meta-list">
          <li><span>App</span><code>{{ store.meta?.name || '--' }}</code></li>
          <li><span>Version</span><code>{{ store.meta?.version || '--' }}</code></li>
          <li><span>Runtime</span><code>{{ store.runtimeLabel }}</code></li>
          <li><span>Electron</span><code>{{ store.meta?.processVersions?.electron || '--' }}</code></li>
          <li><span>Health</span><code>{{ store.health?.checkedAt || '--' }}</code></li>
          <li><span>Memory</span><code>{{ store.health?.memory?.rssMB ?? '--' }} MB</code></li>
        </ul>
        <button class="btn btn-danger" :disabled="!store.runningInElectron">
          {{ store.runningInElectron ? 'Destructive action' : 'Preview mode only' }}
        </button>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAppShellStore } from '../stores/app-shell-store'

const store = useAppShellStore()
let pollTimer = null

const toggleAutoStart = () => {
  store.autoStart = !store.autoStart
  store.pushLog('info', `Auto start ${store.autoStart ? 'enabled' : 'disabled'}`)
}

onMounted(async () => {
  await store.initialize()
  pollTimer = setInterval(() => {
    store.refreshHealth({ silent: true })
  }, 15000)
})

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})
</script>
