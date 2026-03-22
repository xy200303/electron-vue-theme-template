# Electron Vue 主题开发模板

这个模板用于快速启动一个带暗色科技感主题的 Electron + Vue 项目，默认包含可复用的主题 Token、布局骨架和基础组件样式。

## 模板特性

- 深色主题基底与蓝紫品牌渐变
- 顶部拖拽区 + 主内容区 + 右侧滑出面板布局
- 按钮、输入框、下拉框、开关、日志区统一风格
- 主题变量集中管理，便于后续做多主题扩展

## 目录结构

```text
electron-vue-theme-template/
├─ electron/
│  ├─ main.js
│  └─ preload.js
├─ src/
│  ├─ router/
│  │  └─ index.js
│  ├─ styles/
│  │  ├─ tokens.css
│  │  ├─ tokens.json
│  │  ├─ base.css
│  │  └─ components.css
│  ├─ views/
│  │  └─ DashboardView.vue
│  ├─ App.vue
│  └─ main.js
├─ index.html
├─ package.json
└─ vite.config.js
```

## 快速使用

1. 复制 `templates/electron-vue-theme-template` 到你的新项目目录
2. 修改 `package.json` 中的 `name`、`build.appId`、`build.productName`
3. 放置你的图标到 `assets/icon.ico`
4. 执行安装与开发启动

```bash
npm install
npm run electron:dev
```

## 迁移建议

- 保持 `tokens.css` 作为唯一主题入口，业务页面只消费变量
- 页面新增组件时先复用 `components.css` 现有风格，再扩展新块
- 需要多主题时，在 `:root` 之外增加 `[data-theme='light']` 变量覆盖层
