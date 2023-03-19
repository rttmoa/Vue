// 服务端项目的入口文件
// 引入express包
const express = require('express')
// 初始化一个app实例对象
const app = express()
// 准备一个服务端端口号
const port = 3000

// 创建一个路由 '/' 
app.get('/', (req, res) => res.send('<h1>我是服务端渲染</h1>'))

// 监听当前3000端口号 开启服务
app.listen(port, () => console.log(`Example app listening on port ${port}!`))