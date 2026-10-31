<script setup>
// .vue 文件叫「单文件组件」(SFC)，一个文件包含三段：
//   <script setup> —— 逻辑（数据、函数）
//   <template>     —— 页面长相（HTML）
//   <style>        —— 这个组件自己的样式
// Day2 的第一个功能：在这里 fetch('announcements.json') 拿到公告列表
</script>

<template>
  <header class="topbar">
    <h1>校园公告板</h1>
  </header>

  <main class="board">
    <!-- 公告列表渲染区域：Day2 用 v-for 把公告一条条渲染出来 -->
    <p class="placeholder">公告列表区域（骨架占位，等 Day2 实现查看功能）</p>
  </main>
</template>
