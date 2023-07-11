<!-- TODO: 轮播图组件封装  (轮播数据处理++ ) -->
<!-- 多处组件复用 -->
<template>
  <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
    <!-- 图片容器 -->
    <ul class="carousel-body">
      <!-- fade 显示的图片加上 -->
      <li class="carousel-item" v-for="(item, i) in sliders" :key="i" :class="{fade:index===i}">
        <!-- 图片 -->
        <RouterLink v-if="item.imgUrl" to="/">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <!-- 商品列表 item=[goods1,goods2,。。。]-->
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 上一张 -->
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev">
      <i class="iconfont icon-angle-left"></i>
    </a>
    <!-- 下一张 -->
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next">
      <i class="iconfont icon-angle-right"></i>
    </a>
    <!-- 指示器 -->
    <div class="carousel-indicator">
      <!-- active 激活点 -->
      <span @click="index = i" v-for="(item, i) in sliders" :key="i" :class="{active: index === i}"></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // FIXME: 轮播图数据
    sliders: {
      // Data：{id, name, desc, price, picture}
      type: Array,
      default: () => []
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: true // FIXME: 默认 false
    },
    // 间隔时长
    duration: {
      type: Number,
      default: 1500
    }
  },
  setup (props) {

    // 控制显示图片的索引
    const index = ref(0)

    // 1. 自动轮播图的逻辑
    let timer = null
    const autoPlayFn = () => {
      // 防止定时器重复添加
      clearInterval(timer)
      // 自动播放，每隔多久切换索引   FIXME: 每2.5秒切换一次，silders的长度为4，index++即可
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }

    // 需要监听sliders数据变化，判断如果有数据且autoPlay是true
    watch(() => props.sliders, (newVal) => {
      if (newVal.length && props.autoPlay) autoPlayFn()
    }, { immediate: true })

    // 2. 鼠标进入暂停  离开开启自动播放（有开启条件）
    const stop = () => {
      if (timer) clearInterval(timer)
    }
    // 3. 鼠标离开如果autoPlay自动播放
    const start = () => {
      if (props.sliders.length && props.autoPlay) autoPlayFn()
    }

    // 3. 点击点点可以切换，上一张下一张
    const toggle = (step) => { // step: 1 / -1    ||    index: 0.1.2.3
      // 将要改变的索引
      const newIndex = index.value + step
      // 超出的情况，太大了
      if (newIndex > (props.sliders.length - 1)) {
        index.value = 0
        return
      }
      // 超出的情况，太小了
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      // 正常
      index.value = newIndex
    }

    // 4. 组件卸载，清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })

    return { index, stop, start, toggle }
  }
}
</script>

<!-- CSS部分 Less使用方式 -->
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    // active 激活点
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    // 左右翻页按钮，绝对固定
    &-btn {
      width: 44px;
      height: 44px;
      line-height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      opacity: 0;
      transition: all 1s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
      color: aqua;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    // 名称name: 左右padding、文字溢出隐藏
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
