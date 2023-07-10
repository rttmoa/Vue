import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 路由模块：布局，首页，登陆，支付，购物车 等等
import store from './store' // Store：购物车，用户信息，文章分类

// 导入自己UI组件库/library/indexjs -> (Confirm, Message, xtx-city... 自定义全局组件库)
import UI from '@/components/library/index.js'

// 1. 重置样式的库
import 'normalize.css'
// 2. 自己项目的重置样式和公用样式
import '@/assets/styles/common.less'

import '@/mock/index.js'

// 注册createApp： Appjs、Store、Router、UI
createApp(App).use(store).use(router).use(UI).mount('#app')

// UrlAddress
// 首页：    http://localhost:8080/#/

// 分类：     http://localhost:8080/#/category/1043000
// 详情分类： http://localhost:8080/#/category/sub/1008006
// 商品详情： http://localhost:8080/#/product/3434008

// 购物车：   http://localhost:8080/#/cart

// 个人中心：http://localhost:8080/#/member
// 我的订单：http://localhost:8080/#/member/order
// 填写订单：http://localhost:8080/#/member/checkout
// 支付订单：http://localhost:8080/#/member/pay
// 支付结果：http://localhost:8080/#/pay/callback
// 订单详情：http://localhost:8080/#/member/order/1678221211961659393

// 登陆：     http://localhost:8080/#/login
// 联合登陆： http://localhost:8080/#/login/callback