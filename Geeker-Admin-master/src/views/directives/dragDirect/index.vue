<!-- eslint-disable prettier/prettier -->
<template>
  <div class="card content-box">
    <el-alert
      title="此页：使用 v-draggable 可拖拽 /directives/ 自定义指令"
      type="success"
      :closable="false"
    />
    <br />
    <span class="text">拖拽指令 🍇🍇🍇🍓🍓🍓</span>
    <div v-draggable class="drag-box flx-center">我可以拖拽哦~</div>
  </div>
</template>

<script setup lang="ts" name="dragDirect"></script>

<style scoped lang="scss">
@import "./index.scss";
</style>
