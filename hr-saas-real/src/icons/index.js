import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component


// TODO: register globally / 注册全局
Vue.component('svg-icon', SvgIcon)

// 下面三行代码的任务是 把 同级目录的 svg目录下的.svg图片引入到项目中来
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  // console.log("requireContext", requireContext.keys().map(requireContext))
  return requireContext.keys().map(requireContext)
}
requireAll(req)

// 相当于把svg下的所有的svg图片打包到了项目中
// 如果想用svg图片 就在svg目录下去寻找就可以了
