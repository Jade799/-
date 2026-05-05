import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入路由
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router) // 必须在使用 app.mount 之前
app.use(ElementPlus)
app.mount('#app')