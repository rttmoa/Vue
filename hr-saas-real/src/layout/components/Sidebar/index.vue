<template>
  <div :class="{'has-logo':showLogo}">

    <logo v-if="showLogo" :collapse="isCollapse" />

    <!-- 侧边 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>

  </div>
</template>





<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: {
    SidebarItem,
    Logo
  },
  computed: {
    ...mapGetters(['sidebar', 'routes']),

    // 路由 addRoutes之后 不会响应式的更新的组件
    // 默认静态路由 5条  +  addRoutes(6条) = 11条
    // routes() {
    //   return this.$router.options.routes
    // },

    // 根据地址栏中的path去匹配路由
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // console.log(this.$route.meta, this.$route.path)
      if (meta.activeMenu) {
        // console.log("activeMenu")
        return meta.activeMenu
      }
      return path
    },
    // 是否显示
    showLogo() {
      // console.log(this.$store.state.settings.sidebarLogo) // true
      return this.$store.state.settings.sidebarLogo
    },
    // CSS变量
    variables() {
      // console.log("variables", variables)
      return variables
    },
    // 展开关闭侧边栏
    isCollapse() {
      // console.log("this.sidebar", this.sidebar.opened) ////  {opened: true, withoutAnimation: false}
      return !this.sidebar.opened
    }
  }
}
</script>
