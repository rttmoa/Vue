<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem :key="category.top.id" v-if="category.top" :to="`/category/${category.top.id}`">{{category.top.name}}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="category.sub.id" v-if="category.sub">{{category.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
export default {
  name: 'SubBread',
  setup () {
    // 通过计算属性从vuex获取顶级和二级类目信息
    // 数据对象：{top: {id, name}, sub: {id: name}}
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      // 完成获取数据逻辑
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      // console.log('BreadItemData', cate) // {sub: {id: '1008017', name: '收纳'}, top: {id: '1005000', name: '居家'}}
      return cate
    })

    return {
      category
    }
  }
}
</script>
<style scoped lang="less"></style>
