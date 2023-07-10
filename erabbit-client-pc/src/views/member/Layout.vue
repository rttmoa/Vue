<!-- TODO: 会员信息（个人中心） -->
<template>
  <div class="container">

    <!-- 左侧：我的账户 -->
    <AppMemberAside />

    <!-- 右侧：用户信息，订单信息 -->
    <article class="article">
      <RouterView />
    </article>

  </div>
</template>

<script>
import AppMemberAside from '@/components/app-member-aside'
export default {
  name: 'MemberLayout',
  components: {
    AppMemberAside
  }
}
</script>
<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
  }
}
</style>
