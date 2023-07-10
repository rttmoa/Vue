<!-- TODO: Tabs 商品评价 （评论的内容） -->
<template>
  <div class="goods-comment">

    <!-- 评价头部 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{ commentInfo.salesCount }}</span><span>人购买</span></p>
        <p><span>{{ commentInfo.praisePercent }}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a v-for="(item, i) in commentInfo.tags" @click="changeTag(i)" :class="{active: currentTagIndex === i}" :key="item.title" href="javascript:;">
            {{item.title}}（{{item.tagCount}}）
          </a>
        </div>
      </div>
    </div>

    <!-- 排序：默认、最新、最热 -->
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a @click="changeSort(null)" :class="{active:reqParams.sortField===null}" href="javascript:;">默认</a>
      <a @click="changeSort('createTime')" :class="{active:reqParams.sortField==='createTime'}" href="javascript:;">最新</a>
      <a @click="changeSort('praiseCount')" :class="{active:reqParams.sortField==='praiseCount'}" href="javascript:;">最热</a>
    </div>

    <!-- 评价列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <!-- 星星 + 属性 -->
          <div class="score">
            <i v-for="i in item.score" :key="i+'s'" class="iconfont icon-wjx01"></i>
            <i v-for="i in 5-item.score" :key="i+'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- FIXME: 评论图片组件 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures" />
          <div class="time">
            <span>{{item.createTime}}</span>
            <span class="zan">
              <i class="iconfont icon-dianzan"></i>{{item.praiseCount}}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <XtxPagination v-if="total" @current-change="changePagerFn" :page-size="reqParams.pageSize" :current-page="reqParams.page" />

  </div>
</template>
<script>
import { inject, reactive, ref, watch } from 'vue'
import { findGoodsCommentInfo, findGoodsCommentList } from '@/api/product'
import GoodsCommentImage from './goods-comment-image'
export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup () {
    // 获取评价信息
    const commentInfo = ref(null)
    const goods = inject('goods')
    findGoodsCommentInfo(goods.value.id).then((data) => {
      data.result.tags.unshift({
        title: '有图',
        tagCount: data.result.hasPictureCount,
        type: 'img'
      })
      data.result.tags.unshift({
        title: '全部评价',
        tagCount: data.result.evaluateCount,
        type: 'all'
      })
      // console.log('大家都在说', data.result) // FIXME: 大家都在说
      // 设置数据之前，tags数组前追加 有图tag  全部评价tag
      commentInfo.value = data.result
    })

    // 切换 tag
    const currentTagIndex = ref(0)
    const changeTag = (i) => {
      currentTagIndex.value = i
      // 点击tag的时候修改筛选条件
      const tag = commentInfo.value.tags[i]
      // 情况1：全部评价
      // 情况2：有图
      // 情况3：正常tag
      if (tag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = tag.title
      }
      // 重置页码 1
      reqParams.page = 1
    }

    // 点击排序
    const changeSort = (sortField) => {
      // null || createTime || praiseCount
      reqParams.sortField = sortField
      // 重置页码 1
      reqParams.page = 1
    }

    // FIXME: 准备筛选条件数据 （监听参数并发送请求）
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // 排序方式：praiseCount 热度  createTime 最新
      sortField: null
    })

    // FIXME: 初始化需要发请求，筛选条件发生改变发请求
    const commentList = ref([])
    const total = ref(0)
    // TODO: watch监听reqparams对象，如果参数page，pageSize，hasPicture，tag，sortField变化去发请求
    watch(reqParams, () => {
      findGoodsCommentList(goods.value.id, reqParams).then(data => {
        // console.log('评论列表数据', data.result) // {counts: 86, page: '1', pageSize: 10, pages: 9, items: Array(10)}
        const { counts, items } = data.result
        commentList.value = items
        total.value = counts
      })
    }, { immediate: true })

    // 定义转换数据的函数（对应vue2.0的过滤器）
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, ' ').trim()
    }
    // 用户名称
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }

    // 实现分页切换
    const changePagerFn = (newPage) => {
      reqParams.page = newPage
    }

    return { commentInfo, currentTagIndex, changeTag, reqParams, commentList, changeSort, formatSpecs, formatNickname, total, changePagerFn }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
    .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
