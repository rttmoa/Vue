<!-- eslint-disable prettier/prettier -->
<template>
  <div class="card content-box" v-waterMarker="{ text: 'Geeker Admin', textColor: 'rgba(180, 180, 180, 0.6)' }">
    <el-alert
      title="此页：使用 v-waterMarker={text='', textColor: ''} 指定text和颜色 /directives/ 自定义指令"
      type="success"
      :closable="false"
    />
    <br />

    <span class="text">水印指令 🍇🍇🍇🍓🍓🍓</span>
  </div>
</template>

<script setup lang="ts" name="watermarkDirect"></script>

<style scoped lang="scss">
@import "./index.scss";
</style>
