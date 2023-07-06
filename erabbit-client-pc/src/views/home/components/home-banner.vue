<!-- TODO: 右侧轮播图 -->
<template>
  <div class="home-banner">
    <!-- FIXME: 全局组件 -->
    <XtxCarousel auto-play :sliders="sliders" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { findBanner } from '@/api/home'
export default {
  name: 'HomeBanner',
  setup () {
    // 获取轮播图数据
    const sliders = ref([])
    // console.log(sliders) // RefImpl{_rawValue: Array(0), _shallow: false, __v_isRef: true, _value: Proxy(Array)}
    findBanner().then(data => {
      // console.log(data) // {code: '1', msg: '操作成功', result: Array(5) [...,{id: '19', imgUrl: 'http://y...54f4.jpg', hrefUrl: '/category/1013001', type: '1'}]}
      sliders.value = data.result
    })
    return { sliders }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
// 覆盖样式
.xtx-carousel {
  :deep(.carousel-btn.prev){
    left: 270px;
  }
  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}
</style>
