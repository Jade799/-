import { createApp } from 'vue'
import ElementPlus from 'element-plus' // 引入组件库
import 'element-plus/dist/index.css'   // 引入组件库的样式
import App from './App.vue'            // 引入你的主页面

const app = createApp(App)

app.use(ElementPlus)                   // 告诉 Vue 使用这个工具箱
app.mount('#app')                      // 将页面挂载到网页上