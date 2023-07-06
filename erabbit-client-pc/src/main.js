import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 路由模块：布局，首页，登陆，支付，购物车 等等
import store from './store' // Store：购物车，用户信息，文章分类

// UrlAddress
// 首页：     http://localhost:8080/#/
// 分类：     http://localhost:8080/#/category/1043000
// 详情分类： http://localhost:8080/#/category/sub/1008006
// 商品详情： http://localhost:8080/#/product/3434008
// 购物车：   http://localhost:8080/#/cart
// 登陆：     http://localhost:8080/#/login
// 联合登陆： http://localhost:8080/#/login/callback
// member未激活

// 详解vue保存自动格式化换行: http://www.js-code.com/javascript/javascript_85271.html

// 导入自己UI组件库(Confirm, Message)
import UI from '@/components/library'

// 1. 重置样式的库
import 'normalize.css'
// 2. 自己项目的重置样式和公用样式
import '@/assets/styles/common.less'

// mockjs(假数据)
import '@/mock'

// TODO: 注册： Appjs、Store、Router、UI
createApp(App)
    .use(store)
    .use(router)
    .use(UI)
    .mount('#app')