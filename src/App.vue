<script setup>
// .vue 文件叫「单文件组件」(SFC)：<script setup> 逻辑、<template> 长相、<style> 样式
import { ref, computed, onMounted } from 'vue'

// 公告列表：从 announcements.json 读回来的数据存这里
// ref() 让数据变成「响应式」——数据一变，页面自动跟着变
const announcements = ref([])

// 展示用的列表：排序（日期新的在前）+ 最多 20 条
// computed() = 计算属性：依赖的数据变了它自动重算，页面也自动更新
// YYYY-MM-DD 格式的日期是字符串，但直接比大小就等于比时间先后
const visibleAnnouncements = computed(() => {
  return [...announcements.value]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 20)
})

// onMounted = 页面加载完成后执行一次
// fetch(地址) = 向那个地址要数据；这里要的是 public/ 下的 announcements.json
onMounted(async () => {
  const resp = await fetch('announcements.json')
  announcements.value = await resp.json()
})
</script>

<template>
  <header class="topbar">
    <h1>校园公告板</h1>
  </header>

  <main class="board">
    <!-- v-for = 循环渲染：数组里有几条公告，就生成几张卡片 -->
    <ul class="notice-list">
      <li
        v-for="item in visibleAnnouncements"
        :key="item.date + item.title"
        class="notice-card"
      >
        <div class="notice-head">
          <h2 class="notice-title">{{ item.title }}</h2>
          <span class="notice-date">{{ item.date }}</span>
        </div>
        <p class="notice-content">{{ item.content }}</p>
        <span class="notice-author">发布人：{{ item.author }}</span>
      </li>
    </ul>

    <!-- 数据为空时的占位提示（现在 json 是空的，所以你会先看到这句） -->
    <p v-if="visibleAnnouncements.length === 0" class="placeholder">
      暂无公告 —— 往 public/announcements.json 里加数据，这里就会出现列表
    </p>
  </main>
</template>
