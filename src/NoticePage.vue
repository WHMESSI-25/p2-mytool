<script setup>
// 公告详情页：根据地址里的「日期|标题」找到那条公告，展示完整内容
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ param: String })

const announcements = ref([])
onMounted(async () => {
  // ?t=时间戳：绕过浏览器缓存
  const resp = await fetch(`announcements.json?t=${Date.now()}`)
  announcements.value = await resp.json()
})

// 用「日期|标题」匹配公告（数据里没有编号，这个组合目前够用）
const item = computed(() => {
  const idx = (props.param || '').indexOf('|')
  if (idx < 0) return null
  const date = props.param.slice(0, idx)
  const title = props.param.slice(idx + 1)
  return announcements.value.find((a) => a.date === date && a.title === title) || null
})
</script>

<template>
  <main class="board">
    <a class="back-link" href="#/">← 返回公告板</a>

    <p v-if="!item" class="placeholder">公告不存在或已被删除</p>

    <article v-else class="notice-card">
      <div class="notice-head">
        <h2 class="notice-title">{{ item.title }}</h2>
        <span class="notice-date">{{ item.date }}</span>
      </div>
      <!-- 详情页正文完整展示：pre-line 保留换行，不限行数 -->
      <p class="notice-content detail-content">{{ item.content }}</p>
      <img v-if="item.image" :src="item.image" class="notice-img" alt="公告配图" />
      <span class="notice-author">发布人：{{ item.author }}</span>
    </article>
  </main>
</template>
