<!-- TODO: 商品详情 -->
<!-- 商品详情： http://localhost:8080/#/product/3434008 -->
<!-- 瑜伽裤：   http://localhost:8080/#/product/4001126 -->
<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">

      <!-- TODO: 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem>{{goods.name}}</XtxBreadItem>
      </XtxBread>

      <!-- TODO: 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <!-- FIXME: 预览图 放大的位置 TODO:（useMouseInElement 获取 elementX, elementY, isOutside 数据） -->
          <GoodsImage :images="goods.mainPictures" />
          <!-- 销量人气、商品评价、收藏人气、品牌信息 -->
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- FIXME: 商品标题、商品描述、商品价格 + 全国城市 TODO: （获取省市区数据函数、父子组件传值回调） -->
          <GoodsName :goods="goods" />
          <!-- sku组件 skuId="1369155865461919746" 测试选中 -->
          <!-- FIXME: 去选择 规格属性 -->
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- FIXME: 数量选择组件   TODO: (使用vueuse的useVModel做数据绑定,修改 count 通知父组件更新   const count = useVModel(props, 'modelValue', emit) ) -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory" />
          <!-- 按钮组件 -->
          <XtxButton @click="insertCart()" type="primary" style="margin-top: 20px">加入购物车</XtxButton>
        </div>
      </div>

      <!-- TODO: 商品推荐 (轮播图)  -->
      <!-- 轮播图接口处理中需要处理 数据结构  Array(16) [{…}, {…}, {…}, {…}, {…},....] ->  [[4个],[4个],[4个],[4个]]  -->
      <GoodsRelevant :goodsId="goods.id" />

      <!-- TODO: 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- Tabs： 商品 + 评价  动态渲染组件：<component :is="activeName"></component> -->
          <!-- // TODO: 评价列表中： watch监听reqparams对象，如果参数page，pageSize，hasPicture，tag，sortField变化去发请求 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜 + 周热销榜 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import { nextTick, provide, ref, watch } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
// FIXME: 获取商品详情
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // 让商品数据为null然后使用v-if的组件可以重新销毁和创建
        goods.value = null
        nextTick(() => {
          console.log('商品数据', data.result) // FIXME: 接口数据
          // console.log(data.result.mainPictures) // 5张商品详情图片
          goods.value = data.result
        })
      })
    }
  }, { immediate: true })
  return goods
}
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    const goods = useGoods()
    const changeSku = (sku) => {
      // 修改商品的现价原价库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录选择后的sku，可能有数据，可能没有数据{}
      currSku.value = sku
    }

    // FIXME: 提供goods数据给后代组件使用
    provide('goods', goods)

    // 选择的数量
    const num = ref(1)

    // 加入购物车
    const store = useStore()
    const currSku = ref(null)
    const insertCart = () => {
      if (currSku.value && currSku.value.skuId) {
        // id skuId name attrsText picture price nowPrice selected stock count isEffective
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        const newDoc = {
          skuId, // 300425957
          attrsText, // "规格：多功能 款式：10.1寸彩屏"
          stock, // 3625
          id, // "4019874"
          name, // "麦瑞克家用轻音智能多功能彩屏跑步机S450"
          price, // "2812.00"
          nowPrice: price, // "2812.00"
          picture: mainPictures[0], // "https://yanxuan-item.nosdn.127.net/a5d745bbe067ca2468cdb2948f4f10ca.jpg"
          selected: true,
          isEffective: true,
          count: num.value // 1
        }
        // console.log('加入购物车数据', newDoc)
        store.dispatch('cart/insertCart', newDoc).then(() => {
          Message({ type: 'success', text: '加入购物车成功' })
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }

    return { goods, changeSku, num, insertCart }
  }
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }
// .goods-warn {
//   min-height: 600px;
//   background: #fff;
//   margin-top: 20px;
// }
</style>
