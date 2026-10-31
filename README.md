# 校园公告板（p2-mytool）

「Agent 从 0 到精通」P2 项目：一个纯静态的校园公告板。

## 功能

1. **查看**：打开页面就能看到全部公告（按日期新→旧，最多 20 条）
2. **发布**：进入管理页（顶栏右上角）→ 填表单 → 生成 JSON → 复制 → 到 GitHub 网页上粘贴提交
3. **删除**：管理页勾选要删的公告 → 生成删除后的 JSON → 同样复制粘贴提交

## 技术栈与架构（路线甲：GitHub 当后台）

- Vue 3 + Vite（`npm create vite` 脚手架生成）
- 数据：`public/announcements.json`，直接存在本仓库里，不涉及数据库
- 页面：`src/App.vue` 是外壳（按地址 `#/admin` 切换），`src/BoardPage.vue` 公告板，`src/AdminPage.vue` 管理页
- 部署：GitHub Pages，`.github/workflows/deploy.yml` 每次 push 自动构建发布

## 数据流（一句话版）

```
announcements.json（存在 GitHub 仓库里）
   → 页面 fetch 读它
   → Vue 渲染成公告列表
   → 同学的浏览器看到
```

发布/删除 = 管理页帮你把修改后的 JSON 生成好 → 你粘贴回 GitHub 仓库里的这个文件。

## 本地运行

```bash
npm install     # 第一次才需要
npm run dev     # 开发服务器，浏览器打开 http://localhost:5173
npm run build   # 打包产物在 dist/（部署用的就是它）
```

## 发布一条公告的完整流程

1. 打开网站，点顶栏「进入管理」
2. 填标题 / 正文 / 日期 / 作者 → 点「① 生成发布 JSON」
3. 点「复制 JSON」→ 点「打开 GitHub 编辑页」
4. 把内容粘贴进编辑器，点右上角 Commit changes
5. 约等 1 分钟，自动部署完成后全网可见
