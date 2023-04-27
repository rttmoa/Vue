<template>
  <div :class="classObj" class="app-wrapper">

    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />

    <!-- TODO: 侧边栏 -->
    <sidebar class="sidebar-container" />

    <div class="main-container">
      <!-- TODO: 侧边栏 -->
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>

      <!-- TODO: TagsView 放置tagview -->
      <tags-view />

      <!-- TODO: 内容 -->
      <app-main />
    </div>

  </div>
</template>



<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar, // 头
    Sidebar, // 侧边
    AppMain // 内容
  },
  mixins: [ResizeMixin],
  data() {
    // console.log(this.$store.state)
    return {

    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar // sidebar: {opened: true, withoutAnimation: false}
    },
    device() {
      return this.$store.state.app.device // desktop
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader // false
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      // console.log("展开/关闭侧边栏")
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
