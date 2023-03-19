import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'  // 引入vuex包
Vue.use(Vuex) // 注册vuex包


const store = new Vuex.Store({
  // 放置配置选项
  state: {
    count: 0,  // 定义一个count属性
    list: [1,2,3,4,5,6,7,8,9,10]
  },
  mutations: {
    // 修改count的方法
    // 载荷  传输的参数
    addCount (state, payload) {
      console.log(state)
      state.count += payload
    }
  },
  actions: {
    // context 就是当前的store实例 this.$store.commit
    getAsyncCount (context, count) {
      // console.log(count)
      // 模拟异步
      setTimeout(function () {
        context.commit('addCount', count)
      }, 1000)
    }
  },
  // vuex的计算属性
  getters: {
    filterList: state => state.list.filter(item => item > 5),
    token: state => state.user.token,   // 建立了一个getters指向 子模块的属性  快捷访问的属性
    name: state => {
      // console.log(state)
      return state.setting.name;
    }
  },
  // 模块化
  modules: {
    // 子模块
    user: {
      namespaced: true, // 给true就表示加锁
      state: {
        token: 12345
      },
      mutations: {
        updateToken (state) {
          state.token += 666
        }
      },
      actions: {}
    },
    setting: {
      state: {
        name: 'Vuex实例'
      },
      mutations: {
        updateName (state) {
          console.log(state)
        }

      }
    }
  }
})  // 实例化一个Store对象
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
