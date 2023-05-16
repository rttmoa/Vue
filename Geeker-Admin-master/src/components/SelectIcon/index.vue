<!-- eslint-disable prettier/prettier -->
<template>
  <div class="icon-box">
    
    <!-- Input 输入框 -->
    <el-input
      ref="inputRef"
      v-model="valueIcon"
      v-bind="$attrs"
      :placeholder="placeholder" 
      :clearable="clearable"
      @clear="clearIcon"
      @click="openDialog"
    >
      <!-- append 后    prefix 前 -->
      <template #append>
        <el-button :icon="customIcons[iconValue]" />
      </template>
    </el-input>

    <!-- 选择图标弹出框 -->
    <el-dialog v-model="dialogVisible" :title="placeholder" top="50px" width="66%">
      <el-input v-model="inputValue" placeholder="搜索图标" size="large" :prefix-icon="Icons.Search" />
      <!-- TODO: 滚动组件 CSS：放大 -->
      <el-scrollbar v-if="Object.keys(iconsList).length">
        <div class="icon-list" >
          <div v-for="item in iconsList" :key="item" class="icon-item" @click="selectIcon(item)">
            <component :is="item"></component>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </el-scrollbar>
      <el-empty description="未搜索到您要找的图标~" v-else />
    </el-dialog>

  </div>
</template>

<script setup lang="ts" name="SelectIcon">
import { ref, computed } from "vue";
import * as Icons from "@element-plus/icons-vue";

interface SelectIconProps {
  iconValue: string;
  title?: string;
  clearable?: boolean;
  placeholder?: string;
}

// TODO: withDefaults defineProps 图标值 + 标题 + 可清除 + 提示
const props = withDefaults(defineProps<SelectIconProps>(), {
  iconValue: "",
  title: "请选择图标",
  clearable: true,
  placeholder: "请选择图标"
});

// 重新接收一下，防止打包后 clearable 报错
const valueIcon = ref(props.iconValue); // FIXME: iconValue是父组件与子组件传值

// open Dialog
const dialogVisible = ref(false);
const openDialog = () => (dialogVisible.value = true);

// 选择图标(触发更新父组件数据)
const emit = defineEmits(["update:iconValue"]);
const selectIcon = (item: any) => {
  dialogVisible.value = false; // 关闭弹窗
  valueIcon.value = item.name; // 主输入框值
  emit("update:iconValue", item.name); // 更新父组件值
  setTimeout(() => inputRef.value.blur(), 0); // 输入框取消聚焦
};

// 清空图标
const inputRef = ref();
const clearIcon = () => {
  valueIcon.value = "";
  emit("update:iconValue", "");
  setTimeout(() => inputRef.value.blur(), 0); // FIXME: 清空输入框按钮后，输入框自动聚焦
};

// 监听搜索框值 - TODO: 关闭弹窗后打开值还存在
const inputValue = ref("");
const customIcons: { [key: string]: any } = Icons;
// TEST:
// console.log(Icons); // Module {…}  共293个图标
const iconsList = computed((): { [key: string]: any } => {
  if (!inputValue.value) return Icons; // FIXME: 如果输入框内没有值，iconList=Icons
  let result: { [key: string]: any } = {};
  // TODO: for in 对象
  for (const key in customIcons) {
    // console.log(key); // key为每一项的name：Goods
    // console.log(inputValue.value.toLowerCase());
    // console.log(key.toLowerCase().indexOf(inputValue.value.toLowerCase())); // 找到返回索引位置，未找到返回-1
    if (key.toLowerCase().indexOf(inputValue.value.toLowerCase()) > -1) result[key] = customIcons[key];
  }
  return result;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
