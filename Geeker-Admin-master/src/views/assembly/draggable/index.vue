<!-- eslint-disable prettier/prettier -->
<template>
    <el-alert
      title="此页：使用npm-vuedraggable可拖拽组件  +  <template #item='{ element }'></template>自定义模板   "
      type="success"
      :closable="false"
    />
    <br />

  <draggable
    class="card grid-container"
    v-model="gridList"
    item-key="id"
    animation="1000"
    chosenClass="chosen"
    forceFallback="true"
  >
    <template #item="{ element }">
      <div :class="'item' + ' ' + 'item-' + element.num">
        {{ element.num }}
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts" name="draggable">
import { ref } from "vue";
import draggable from "vuedraggable";

let gridList = ref([
  { id: 1, num: 1 },
  { id: 2, num: 2 },
  { id: 3, num: 3 },
  { id: 4, num: 4 },
  { id: 5, num: 5 },
  { id: 6, num: 6 },
  { id: 7, num: 7 },
  { id: 8, num: 8 },
  { id: 9, num: 9 }
]);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
