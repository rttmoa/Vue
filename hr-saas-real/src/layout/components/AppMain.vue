<template>
  <section class="app-main">

    <!-- TODO: router-view -->
    <!-- https://blog.csdn.net/m0_46309087/article/details/119701254 -->
    <!-- https://router.vuejs.org/zh/guide/#html -->
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>

  </section>
</template>





<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      // console.log("AppMain-router", this.$route.path)
      return this.$route.path; // TODO: 在这里根据地址栏路径切换具体的页面的内容
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
