<script setup>
// 应用外壳：根据地址栏 # 后面的部分决定显示哪个页面
// #/admin → 管理页；其它 → 公告板
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BoardPage from './BoardPage.vue'
import AdminPage from './AdminPage.vue'

const route = ref(window.location.hash)
const onHashChange = () => (route.value = window.location.hash)
onMounted(() => window.addEventListener('hashchange', onHashChange))
onUnmounted(() => window.removeEventListener('hashchange', onHashChange))

const isAdmin = computed(() => route.value === '#/admin')
</script>

<template>
  <header class="topbar">
    <h1>校园公告板</h1>
    <a class="topbar-link" :href="isAdmin ? '#/' : '#/admin'">
      {{ isAdmin ? '返回公告板' : '进入管理' }}
    </a>
  </header>
  <AdminPage v-if="isAdmin" />
  <BoardPage v-else />
</template>
