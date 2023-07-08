<template>
  <!-- TODO: 筛选区 （ filterData  changeBrand  changeProp ） -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="changeBrand(item.id)" :class="{active: item.id === filterData.selectedBrand}" href="javascript:;"
          v-for="item in filterData.brands" :key="item.id"
        >
          {{item.name}}
        </a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <!-- 颜色、规格 -->
      <div class="head">{{item.name}}: </div>
      <div class="body">
        <a @click="changeProp(item, prop.id)" :class="{active: prop.id === item.selectedProp}" href="javascript:;"
          v-for="prop in item.properties" :key="prop.id">
          <!-- 颜色、规格下的属性 -->
          {{prop.name}}
        </a>
      </div>
    </div>
  </div>
  <!-- Loading Skeleton -->
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',

  setup (props, { emit }) {
    const route = useRoute()
    // 监听二级类目ID的变化获取筛选数据
    const filterData = ref(null)
    // Filter处的加载效果
    const filterLoading = ref(false)
    // TODO: 处理接口返回的数组并赋值给 filterData ref
    watch(() => route.params.id, (newVal) => {
      // 变化后的ID有值 且 处在二级类名路由下
      // console.log(route.path) // /category/sub/1008006
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        // 发请求获取数据
        findSubCategoryFilter(route.params.id).then(data => {
          // console.log(data.result)
          // FIXME: 处理接口返回的数组并赋值给 filterData ref {
          //   id: '1008006', name: '影音娱乐', picture: null, parentId: '1043000', parentName: '数码',
          //   brands: Array(2), goods: Array(8), categories:  Array(6), saleProperties: Array(2), selectedBrand: null
          // }
          // 每一组可选的筛选条件缺失 全部 条件，处理下数据加上全部
          // 给每一组数据加上一个选中的ID
          // 1. 品牌
          data.result.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' }) // 品牌数组中索引加 （全部）
          // 2. 属性
          data.result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({ id: null, name: '全部' }) // 出售属性中每一个过滤条件前面加 （全部）
          })
          // 设置修改的数据
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    // 获取筛选参数的函数
    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] }
      // 品牌
      obj.brandId = filterData.value.selectedBrand
      // 销售属性
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp) // 出售属性 没有选择属性
          // console.log(item) // {id: '1482377793620803585', name: '规格', properties: Array(10), selectedProp: '1482377794157674499'}
          // console.log(prop) // {id: '1482377794157674499', name: '黑色Type-C版'}
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      // 参考数据：{brandId:'', attrs:[{groupName:'', propertyName:''},...]}
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }

    // TODO: 1. 记录当前选择的品牌 (品牌)
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return // 点击的是选中的
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    // TODO: 2. 记录呢选择的销售属性 (规格, 数量, 类型)
    const changeProp = (item, propId) => {
      if (item.selectedProp === propId) return
      item.selectedProp = propId
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changeBrand, changeProp }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
    .xtx-skeleton {
      padding: 10px 0;
    }
  }
</style>
