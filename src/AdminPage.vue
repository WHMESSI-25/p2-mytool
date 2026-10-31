<script setup>
// 管理页：路线甲下公告数据存在 GitHub 仓库里，本页不直接改数据，
// 而是帮你把改好的 announcements.json 生成出来 → 复制 → 跳去 GitHub 粘贴提交
import { ref, onMounted } from 'vue'

// GitHub 编辑页：管理页生成 JSON 后跳到这里粘贴提交
const GITHUB_EDIT_URL =
  'https://github.com/WHMESSI-25/p2-mytool/edit/main/public/announcements.json'

// ===== 管理密码门（同学反馈：任何人都能进管理页会混乱） =====
// 这是「君子锁」：挡随手乱点的人。数据安全由 GitHub 写权限保证（只有仓库主人能提交）
const PASSWORD_SHA256 = '1e4e8b049223c94c574465b3d3755ad6fbabb1d8a2898480ff90b44d07c34369'
const unlocked = ref(localStorage.getItem('p2_admin_ok') === PASSWORD_SHA256)
const pwd = ref('')
const pwdErr = ref('')

async function tryUnlock() {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd.value))
  const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  if (hex === PASSWORD_SHA256) {
    unlocked.value = true
    localStorage.setItem('p2_admin_ok', hex)
    pwdErr.value = ''
  } else {
    pwdErr.value = '密码不对，再想想'
  }
}

// 当前公告列表（从数据文件读进来，作为生成新 JSON 的底稿）
const announcements = ref([])
onMounted(async () => {
  // ?t=时间戳：绕过浏览器缓存，保证读到的删除列表也是最新的
  const resp = await fetch(`announcements.json?t=${Date.now()}`)
  announcements.value = await resp.json()
})

// 今天日期（本地时区），作为发布表单的默认值
const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 发布表单四个字段 + 可选配图链接
const title = ref('')
const content = ref('')
const date = ref(today())
const author = ref('')
const image = ref('')

// 删除勾选（存要删的公告在列表中的序号）
const checked = ref([])

// 提示信息 + 输出区
const tip = ref('')
const outputJson = ref('')
const outputMode = ref('') // add = 发布，delete = 删除
const copied = ref(false)

// 生成「发布」版 JSON：新公告插到最前面
function genAdd() {
  if (!title.value || !content.value || !date.value || !author.value) {
    tip.value = '四个格子都要填才能生成'
    return
  }
  tip.value = ''
  const entry = { title: title.value, content: content.value, date: date.value, author: author.value }
  // 配图是可选字段：不填就不写进 JSON
  if (image.value) entry.image = image.value
  const next = [entry, ...announcements.value]
  outputJson.value = JSON.stringify(next, null, 2)
  outputMode.value = 'add'
}

// 生成「删除后」的 JSON：去掉勾选的
function genDelete() {
  if (checked.value.length === 0) {
    tip.value = '先在上面勾选要删除的公告'
    return
  }
  tip.value = ''
  const next = announcements.value.filter((_, i) => !checked.value.includes(i))
  outputJson.value = JSON.stringify(next, null, 2)
  outputMode.value = 'delete'
}

// 复制到剪贴板
async function copyJson() {
  try {
    await navigator.clipboard.writeText(outputJson.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    tip.value = '自动复制失败：请手动全选下面的文本复制'
  }
}
</script>

<template>
  <main class="board">
    <!-- 密码锁：没解锁前只看到这个卡片 -->
    <section v-if="!unlocked" class="admin-card">
      <h2 class="page-title" style="margin-top: 0">🔒 管理页已上锁</h2>
      <p class="tip">这里是管理员功能，输入管理密码继续（密码找公告管理员要）。</p>
      <div class="row">
        <input
          class="pwd-input"
          type="password"
          v-model="pwd"
          placeholder="管理密码"
          @keyup.enter="tryUnlock"
        />
        <button class="btn" @click="tryUnlock">解锁</button>
      </div>
      <p v-if="pwdErr" class="tip">{{ pwdErr }}</p>
    </section>

    <template v-else>
      <h2 class="page-title">发布新公告</h2>
      <section class="admin-card">
        <label class="field">
          标题
          <input v-model="title" placeholder="一句话说清这件事" />
        </label>
        <label class="field">
          正文
          <textarea v-model="content" rows="3" placeholder="详细内容"></textarea>
        </label>
        <div class="row">
          <label class="field">
            日期
            <input type="date" v-model="date" />
          </label>
          <label class="field">
            作者
            <input v-model="author" placeholder="如：教务处王老师" />
          </label>
        </div>
        <label class="field">
          图片链接（可选，不填就没图）
          <input v-model="image" placeholder="先在 GitHub 上传图片到 public/img/，再粘贴它的网址" />
        </label>
        <button class="btn" @click="genAdd">① 生成发布 JSON</button>
      </section>

      <h2 class="page-title">删除公告</h2>
      <section class="admin-card">
        <p v-if="announcements.length === 0" class="placeholder">还没有公告可删</p>
        <label v-for="(a, i) in announcements" :key="i" class="check-row">
          <input type="checkbox" :value="i" v-model="checked" />
          <span>{{ a.date }}｜{{ a.title }}</span>
        </label>
        <button class="btn btn-outline" @click="genDelete">① 生成删除后 JSON</button>
      </section>

      <p v-if="tip" class="tip">{{ tip }}</p>

      <section v-if="outputJson" class="admin-card">
        <h2 class="page-title">第 2 步：复制 → 去 GitHub 粘贴提交</h2>
        <textarea class="json-box" readonly :value="outputJson" rows="14"></textarea>
        <div class="row">
          <button class="btn" @click="copyJson">{{ copied ? '✅ 已复制' : '复制 JSON' }}</button>
          <a v-if="GITHUB_EDIT_URL" class="btn btn-outline" :href="GITHUB_EDIT_URL" target="_blank">
            打开 GitHub 编辑页 →
          </a>
        </div>
        <p class="tip">
          粘贴后点右上角 Commit changes，约 1-2 分钟全网生效（缓存上限 10 分钟）；若公告板没变化，按 Ctrl+F5 硬刷新。
        </p>
      </section>
    </template>
  </main>
</template>
