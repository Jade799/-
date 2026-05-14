import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 百度云内容审核代理配置
      '/baidu-api': {
        target: 'https://aip.baidubce.com', // 百度云 API 的原始域名
        changeOrigin: true,                // 允许跨域
        rewrite: (path) => path.replace(/^\/baidu-api/, '') // 转发时去掉 /baidu-api 前缀
      }
    }
  }
})