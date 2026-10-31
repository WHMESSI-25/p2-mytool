import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // 打包时带上子路径：GitHub Pages 项目站点部署在 /p2-mytool/ 下
  // 开发时保持根路径，本地访问不变
  base: command === 'build' ? '/p2-mytool/' : '/',
  plugins: [vue()],
}))
