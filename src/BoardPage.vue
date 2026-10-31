<script setup>
// 公告板主页：读数据 → 排序 → 渲染卡片列表（点击卡片进详情页）
import { ref, computed, onMounted } from 'vue'

// 公告列表：从 announcements.json 读回来的数据存这里
const announcements = ref([])

// 展示用：日期新的在前，最多 20 条
const visibleAnnouncements = computed(() => {
  return [...announcements.value]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 20)
})

// 页面加载完成后去读数据文件
onMounted(async () => {
  // ?t=时间戳：绕过浏览器缓存，保证每次打开都拿到最新公告
  const resp = await fetch(`announcements.json?t=${Date.now()}`)
  announcements.value = await resp.json()
})
</script>

<template>
  <main class="board">
    <div class="notice-list">
      <!-- 卡片是链接：点击进详情页，地址带上「日期|标题」用于找到这条公告 -->
      <a
        v-for="item in visibleAnnouncements"
        :key="item.date + item.title"
        class="notice-card"
        :href="'#/notice/' + encodeURIComponent(item.date + '|' + item.title)"
      >
        <div class="notice-head">
          <h2 class="notice-title">{{ item.title }}</h2>
          <span class="notice-date">{{ item.date }}</span>
        </div>
        <p class="notice-content">{{ item.content }}</p>
        <!-- 可选配图：公告带 image 字段就渲染 -->
        <img v-if="item.image" :src="item.image" class="notice-img" alt="公告配图" />
        <span class="notice-author">发布人：{{ item.author }}</span>
      </a>
    </div>

    <p v-if="visibleAnnouncements.length === 0" class="placeholder">
      暂无公告 —— 去「进入管理」发布第一条吧
    </p>
  </main>
</template>
