# 校园公告板（p2-mytool）

「Agent 从 0 到精通」P2 项目：一个纯静态的校园公告板。

## 功能（对应三条用户故事）

1. 打开页面就能看到全部公告（按时间倒序）
2. 管理员可发布公告（在 GitHub 网页上编辑数据文件）
3. 管理员可删除发错的公告（同样在 GitHub 网页上操作）

## 技术栈

- Vue 3 + Vite（脚手架 `npm create vite` 生成）
- 数据：`public/announcements.json`（路线甲：GitHub 当后台）
- 部署：GitHub Pages

## 数据流（一句话版）

```
announcements.json（存在 GitHub 仓库里）
   → 页面 fetch 读它
   → Vue 渲染成公告列表
   → 同学的浏览器看到
```

## 本地运行

```bash
npm install     # 第一次才需要，装依赖
npm run dev     # 启动开发服务器，浏览器打开 http://localhost:5173
```

## 发布一条公告的流程（路线甲）

1. 打开本仓库的 `public/announcements.json` 编辑页
2. 按格式加一条公告（Day5 会做页面上的发布助手来简化这步）
3. 提交 commit，等 GitHub Pages 自动更新（约 1 分钟）
