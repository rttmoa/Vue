<!-- eslint-disable prettier/prettier -->
<template>
  <div class="card content-box">
    <el-alert
      title="此页：使用 v-debounce 防抖指令 /directives/ 自定义指令"
      type="success"
      :closable="false"
    />
    <br />
    
    <span class="text">防抖指令 🍇🍇🍇🍓🍓🍓</span>
    <el-button type="primary" v-debounce="debounceClick">防抖按钮 (0.5秒后执行)</el-button>
  </div>
</template>

<script setup lang="ts" name="debounceDirect">
import { ElMessage } from "element-plus";
const debounceClick = () => {
  ElMessage.success("我是防抖按钮触发的事件 🍍🍓🍌");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
