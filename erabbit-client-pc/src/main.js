import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 路由模块：布局，首页，登陆，支付，购物车 等等
import store from './store' // Store：购物车，用户信息，文章分类





// 导入自己UI组件库(Confirm, Message)
import UI from '@/components/library'


// 1. 重置样式的库
import 'normalize.css'
// 2. 自己项目的重置样式和公用样式
import '@/assets/styles/common.less'


// mockjs(假数据)
import '@/mock'


// TODO: 注册：Appjs、Store、Router、UI
createApp(App).use(store).use(router).use(UI).mount('#app')