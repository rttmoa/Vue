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
    findBanner().then(data => {
      // console.log('轮播图Data', data.result)
      sliders.value = data.result
    })
    return {
      sliders
    }
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
