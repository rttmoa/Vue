// 目标：是把vue组件的渲染从客户端放到了服务端
// 目的： 既想使用vue继续开发项目 享受vue提供的高效的开发方式 而且我们还想让首屏渲染时间短  
// 解决方案：把vue组件的渲染的地方放到服务端进行即可

// 引入vue框架
const Vue = require('vue')

// 引入express框架 进行服务端功能开发
const server = require('express')()

// 引入vue服务端渲染插件 帮助我们把vue组件渲染成字符串
const renderer = require('vue-server-renderer').createRenderer()

// 编写一个通用路由 ->  new一个Vue实例 ->  把vue实例渲染成字符串(组件字符串)


server.get('*', (req, res) => {
  // 实例化vue 
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `
     <div>
        访问的 URL 是：{{ url }}
        <button @click="alert(123)">click me!</button>
     </div>`,
  })
  renderer.renderToString(app, (err, html) => {
    if (err) throw err
    res.send(html)
  })
})


// 监听一个服务 端口8888
server.listen(8888,() => console.log(`Example app listening on port 8888!`))

// 1.通过访问源代码 我们发现确实是服务端渲染  保证了首屏渲染时间短
// 2.我们还继续使用了vue的组件开发模式

