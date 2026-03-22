# Electron Vue 企业级启动模板（简化版）

[English](./README.md) | 中文

这是一个简洁的 Electron + Vue 企业级范式模板：

- 主进程分层（`config / windows / ipc / bootstrap`）
- 安全预加载桥接（`contextIsolation + 白名单 API`）
- IPC 通道统一定义在 `electron/ipc/channels.json`
- 渲染层通过 Pinia store 驱动

## 快速开始

```bash
bun install
bun run electron:dev
```

构建前端：

```bash
bun run build
```

打包应用：

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
  views/DashboardView.vue     # 运行面板示例
```

## 为什么使用 `electron/ipc/channels.json`

`electron/ipc/channels.json` 是 IPC 通道名的单一事实来源。

- 主进程在注册处理器时读取它（`ipcMain.handle`）
- 预加载层在发起调用时读取它（`ipcRenderer.invoke`）
- 避免字符串硬编码导致的通道名不一致

## 开发者指南

### 新增 IPC 能力的步骤

1. 在 `electron/ipc/channels.json` 新增通道键
2. 在 `electron/main/ipc/register-handlers.js` 注册 `ipcMain.handle`
3. 在 `electron/preload.js` 暴露安全方法
4. 推荐在 Pinia store 里统一消费，避免组件内散落调用 `window.appShell`

### 主进程职责边界

- `electron/main.js` 只保留启动编排
- 窗口逻辑放在 `electron/main/windows/*`
- 运行时与环境解析放在 `electron/main/config/*`
- IPC 处理与应用服务放在 `electron/main/ipc/*`

### 安全检查清单

- 保持 `nodeIntegration: false`
- 保持 `contextIsolation: true`
- 仅通过预加载层暴露白名单 API
- IPC 入参先校验，再触达文件系统/网络

### 开发流程建议

- 提交前执行 `bun run build`
- 优先小步提交：一个功能或一类重构一组提交
- 文档变更时同步更新 `README.md` 与 `README.zh-CN.md`

## 环境变量

- `VITE_DEV_SERVER_URL`（默认：`http://127.0.0.1:5174`）
- `ELECTRON_OPEN_DEVTOOLS`（`true` 时开发模式自动打开 DevTools）
- `ELECTRON_TRUSTED_ORIGINS`（逗号分隔的可信来源）

## 说明

- Windows 安装包打包前需要准备 `assets/icon.ico`。
