# Electron Vue Enterprise Starter (Simple)
English | [中文](./README.zh-CN.md)

This is a minimal enterprise-style starter for Electron + Vue:

- Layered Electron main process (`config / windows / ipc / bootstrap`)
- Secure preload bridge (`contextIsolation + whitelist API`)
- Single-source IPC channels in `electron/ipc/channels.json`
- Store-driven renderer state with Pinia
<img width="1908" height="1271" alt="image" src="https://github.com/user-attachments/assets/ef7783df-a40b-4fb6-893b-51d0d587339d" />

## Quick Start

```bash
bun install
bun run electron:dev
```

Build renderer:

```bash
bun run build
```

Package app:

```bash
bun run electron:pack
```

## Project Structure

```text
electron/
  main.js                     # main entry
  preload.js                  # secure bridge to renderer
  ipc/channels.json           # IPC channel contract
  main/
    bootstrap.js              # lifecycle + single instance
    config/runtime-config.js  # runtime config
    windows/main-window.js    # BrowserWindow + navigation policy
    ipc/register-handlers.js  # ipcMain handlers
    utils/logger.js           # logger
src/
  stores/app-shell-store.js   # renderer runtime state
  views/DashboardView.vue     # runtime panel demo
```

## Why `electron/ipc/channels.json`

`electron/ipc/channels.json` is the single source of truth for IPC channel names.

- Main process reads it when registering handlers (`ipcMain.handle`)
- Preload reads it when invoking handlers (`ipcRenderer.invoke`)
- Keeps channel names consistent and avoids hardcoded string mismatches

## Developer Guide

### Add a new IPC capability

1. Add a channel key in `electron/ipc/channels.json`
2. Register an `ipcMain.handle` in `electron/main/ipc/register-handlers.js`
3. Expose a safe preload method in `electron/preload.js`
4. Consume it from a Pinia store (recommended) instead of calling `window.appShell` in many components

### Main-process boundaries

- Keep `electron/main.js` as bootstrap only
- Put window logic in `electron/main/windows/*`
- Put runtime/env parsing in `electron/main/config/*`
- Put app services and handlers in `electron/main/ipc/*`

### Security checklist

- Keep `nodeIntegration: false`
- Keep `contextIsolation: true`
- Expose only whitelisted preload methods
- Validate incoming IPC payloads before touching filesystem/network

### Dev workflow suggestions

- Run `bun run build` before commits
- Prefer small PRs: one feature or one refactor per commit group
- Update both `README.md` and `README.zh-CN.md` when docs change

## Environment Variables

- `VITE_DEV_SERVER_URL` (default: `http://127.0.0.1:5174`)
- `ELECTRON_OPEN_DEVTOOLS` (`true` opens devtools in dev mode)
- `ELECTRON_TRUSTED_ORIGINS` (comma-separated trusted origins)

## Notes

- `assets/icon.ico` is required for Windows installer packaging.
