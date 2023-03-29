<template>
  <div class="container">
    <Logo /> {{ name }}
    <div class="articleList">
      <el-collapse>
        <el-collapse-item
          v-for="article in articleList"
          :key="article.art_id"
          :title="article.title"
        >
          <div>评论数：{{ article.comm_count }}点赞数：{{ article.like_count }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  // asyncData
  // 调用时机:页面组件中组件渲染之前 自动调用
  // 特点：nuxtjs会帮助我们把asyncData函数的返回值 和 data配置项返回的响应式数据做融合处理 融合起来之后一同交给
  // 当前的组件使用
  // api调用写法：async + await的形式 正常使用axios就可以
  async asyncData ({ $axios }) {
    // 使用axios发起get请求
    const url = 'http://ttapi.research.itcast.cn/app/v1_1/articles?channel_id=0&timestamp=1606309443970&with_top=1'
    const res = await $axios.$get(url)
    // eslint-disable-next-line no-console
    console.log('返回值为:', res.data.results)
    return {
      articleList: res.data.results
    }
  },
  data () {
    return {
      name: 'cp'
    }
  }
}
// 1.如何加入路由功能呢？
// 2.如果在nuxtjs中使用状态管理工具呢？vuex
// 3.使用nuxt.js开发的项目如何完成部署上线呢？ 依赖什么？ 客户端  客户端 服务端

</script>

<style>
.container{
  padding:0 200px;
}
.articleList{
  margin-top:30px;
}
</style>
