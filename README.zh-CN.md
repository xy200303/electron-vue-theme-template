# Electron Vue 企业级启动模板（简化版）

[English](./README.md) | 中文

<img width="1919" height="1305" alt="image" src="https://github.com/user-attachments/assets/3961427a-f381-4bb9-991f-e9dec10f6c2d" />

这是一个“尽量简单”的 Electron + Vue 企业级范式模板，保留必要工程能力：

- 主进程分层（`config / windows / ipc / bootstrap`）
- 安全预加载桥接（`contextIsolation + 白名单 API`）
- IPC 通道统一定义在 `electron/ipc/channels.json`
- 渲染层由 Pinia store 驱动

## 快速开始

```bash
bun install
bun run electron:dev
```

构建前端：

```bash
bun run build
```

打包桌面应用：

```bash
bun run electron:pack
```

## 目录结构

```text
electron/
  main.js                     # 主进程入口
  preload.js                  # 渲染层安全桥
  ipc/channels.json           # IPC 通道契约
  main/
    bootstrap.js              # 生命周期与单实例控制
    config/runtime-config.js  # 运行时配置
    windows/main-window.js    # 窗口创建与导航策略
    ipc/register-handlers.js  # ipcMain 处理器
    utils/logger.js           # 日志
src/
  stores/app-shell-store.js   # 渲染层运行时状态
  views/DashboardView.vue     # 运行面板示例页
```

## 环境变量

- `VITE_DEV_SERVER_URL`（默认 `http://127.0.0.1:5174`）
- `ELECTRON_OPEN_DEVTOOLS`（设为 `true` 时开发模式自动打开 DevTools）
- `ELECTRON_TRUSTED_ORIGINS`（逗号分隔的可信来源列表）

## 说明

- Windows 安装包打包前需要准备 `assets/icon.ico`。
