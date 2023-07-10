<!-- TODO: Tabs 商品详情 （描述 + 描述图片） -->
<template>
  <div class="goods-detail">

    <!-- 属性 -->
    <ul class="attrs">
      <li v-for="item in goods.details.properties" :key="item.value">
        <span class="dt">{{item.name}}</span>
        <span class="dd">{{item.value}}</span>
      </li>
    </ul>

    <!-- 图片 FIXME: 渲染截图3张图片  item是url -->
    <img v-for="item in goods.details.pictures.splice(0, 3)" :key="item" :src="item" alt="">

  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'GoodsDetial',
  setup () {
    const goods = inject('goods')
    // console.log('属性+描述图片', goods)
    return { goods }
  }
}
</script>
<style scoped lang="less">
.goods-detail {
  padding: 40px;
  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;
      .dt {
        width: 100px;
        color: #999;
      }
      .dd {
        flex: 1;
        color: #666;
      }
    }
  }
  > img {
    width: 100%;
  }
}
</style>
