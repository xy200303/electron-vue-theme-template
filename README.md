# Electron Vue Enterprise Starter (Simple)

<img width="1919" height="1305" alt="image" src="https://github.com/user-attachments/assets/b5364ee0-086a-4aeb-9acb-f6bf708d2b0b" />

English | [中文](./README.zh-CN.md)

This is a minimal enterprise-style starter for Electron + Vue:

- Layered Electron main process (`config / windows / ipc / bootstrap`)
- Secure preload bridge (`contextIsolation + whitelist API`)
- Single-source IPC channels in `electron/ipc/channels.json`
- Store-driven renderer state with Pinia

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

## Environment Variables

- `VITE_DEV_SERVER_URL` (default: `http://127.0.0.1:5174`)
- `ELECTRON_OPEN_DEVTOOLS` (`true` opens devtools in dev mode)
- `ELECTRON_TRUSTED_ORIGINS` (comma-separated trusted origins)

## Notes

- `assets/icon.ico` is required for Windows installer packaging.
