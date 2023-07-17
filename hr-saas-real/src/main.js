import Vue from 'vue'
import 'normalize.css/normalize.css' // CSS 重置的现代替代方案
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // Vue2使用element-ui引入自定义主题的方法
import '@/styles/index.scss' // 全局 CSS
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n


import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives'
import * as filters from '@/filters'
import Components from '@/components'
import VuePrint from 'vue-print-nb'
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang' // 引入i18n实例
import '@/icons' // icon
import '@/permission' // permission control

// directives是所有指令的一个集合
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(Components) // 注册自己的自定义组件
Vue.mixin(checkPermission) // TODO: 全局混入  会让所有的组件都自动拥有该混入组件的方法和属性
Vue.use(VuePrint) // 注册打印插件
// set ElementUI lang to EN
Vue.use(ElementUI, {
  // t方法是去找 对应的语言下的 显示值
  i18n: (key, value) => i18n.t(key, value)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.config.productionTip = false;


new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
