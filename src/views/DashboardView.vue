<template>
  <section class="dashboard-page">
    <header class="top-bar panel">
      <div class="title-block">
        <h1>Electron Theme Template</h1>
        <p>暗色科技感模板首页</p>
      </div>
      <div class="action-row">
        <button class="btn btn-ghost">次级操作</button>
        <button class="btn">主要操作</button>
      </div>
    </header>

    <div class="content-grid">
      <main class="main-area panel">
        <div class="section-head">
          <h2>基础设置</h2>
        </div>
        <div class="field-grid">
          <label class="field">
            <span>服务地址</span>
            <input class="input" type="text" value="http://127.0.0.1:3999" />
          </label>
          <label class="field">
            <span>运行模式</span>
            <select class="select">
              <option>标准模式</option>
              <option>安全模式</option>
            </select>
          </label>
        </div>
        <div class="switch-row">
          <span>自动启动</span>
          <button class="switch is-on">
            <span class="switch-dot"></span>
          </button>
        </div>

        <div class="log-area">
          <div class="log-row">[INFO] 模板已加载</div>
          <div class="log-row">[INFO] 主题色: #00d4ff / #7b2ff7</div>
          <div class="log-row">[WARN] 你可以按业务扩展组件样式</div>
        </div>
      </main>

      <aside class="slide-panel panel">
        <h3>快捷面板</h3>
        <p>用于放置任务、帮助、状态等次级信息。</p>
        <button class="btn btn-danger">危险操作</button>
      </aside>
    </div>
  </section>
</template>

<script setup>
</script>
