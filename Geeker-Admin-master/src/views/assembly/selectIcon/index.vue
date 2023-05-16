<!-- eslint-disable prettier/prettier -->
<template>
  <div class="card content-box">
    <span class="text"> 图标选择器 🍓🍇🍈🍉</span>
    <el-alert
      title="此页：组件： {el-descriptions} + {SelectIcon}自定义组件"
      type="success"
      :closable="false"
    />
    <br />
    <el-alert
      title="SelectIcon组件中： 一、computed计算输入框中的值与Icons是否匹配，显示匹配的图标"
      type="success"
      :closable="false"
    />
    <br /> 
    <el-alert
      title="SelectIcon组件中： 二、有四个Ref控制数据"
      type="success"
      :closable="false"
    />
    <br />

    <SelectIcon v-model:icon-value="iconValue" />
    
    <el-descriptions title="配置项 📚" :column="1" border>
      <el-descriptions-item label="iconValue"> 双向绑定的icon值，使用示例：v-model:icon-value="iconValue" </el-descriptions-item>
      <el-descriptions-item label="title"> 弹窗标题 </el-descriptions-item>
      <el-descriptions-item label="clearable"> 是否可清空，默认为 true </el-descriptions-item>
      <el-descriptions-item label="placeholder"> 输入框占位文本 </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts" name="selectIcon">
import { ref } from "vue";
import SelectIcon from "@/components/SelectIcon/index.vue";
const iconValue = ref("");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
