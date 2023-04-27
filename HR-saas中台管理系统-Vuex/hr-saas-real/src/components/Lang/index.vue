<template>

  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 放置一个多语言图标 -->
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <!-- 下拉菜单选项 -->
    <el-dropdown-menu>
      <el-dropdown-item :disabled="$i18n.locale === 'zh'" command="zh">zh</el-dropdown-item>
      <el-dropdown-item :disabled="$i18n.locale === 'en'" command="en">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</template>



<!-- TODO: Navbar 切换语言 -->
<!-- 这个 i18n和message是全局绑定的关系 -->
<script>
  import Cookie from 'js-cookie';
  export default {
    methods: {
      //  切换多语言
      changeLanguage(type) {
        // console.log("this.$i18n.locale", this.$i18n.locale) // zh/en
        this.$i18n.locale = type;
        Cookie.set('language', type) // 设置多语言类型
        this.$message.success('多语言切换成功')
      }
    }
  }
</script>

<style>
</style>
