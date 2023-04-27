<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon
      icon-class="fullscreen"
      style="color:#fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>



<!-- TODO: Navbar 全屏图标 -->
<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    changeScreen() {
      // js的方式
      // esc退出
      if (!ScreenFull.isEnabled) {
        //   如果不可用  就提示 并且返回
        this.$message.warning('当前全局组件不可用')
        return
      }
      // document.documentElement.requestFullscreen()  // DOM打开
      // document.exitFullscreen() // DOM退出
      ScreenFull.toggle() // 执行全屏  展开/关闭
    }
  }
}
</script>

<style>

</style>
