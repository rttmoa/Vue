<!-- eslint-disable prettier/prettier -->
<template>
  <div class="card content-box">
    <el-alert 
      title="此页面：组件{el-form}+{el-form-item}+{el-input}+{el-select}={el-option}={el-date-picker}={el-col}={el-switch}={el-checkbox-group}={el-checkbox}={el-radio-group}={}"
      type="success"
      :closable="false"
    />
    <br />
    <el-alert 
      title="此页面：值 :model='formData'  v-model='formData.name' @click=onSubmit "
      type="success"
      :closable="false"
    />
    <br />
    <el-form :model="formData" label-width="140px">
      <el-form-item label="Activity name :">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="Activity zone :">
        <el-select v-model="formData.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time :">
        <el-date-picker v-model="formData.date1" type="date" placeholder="Pick a date" />
        <el-col :span="1" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-time-picker v-model="formData.date2" placeholder="Pick a time" />
      </el-form-item>
      <el-form-item label="Instant delivery :">
        <el-switch v-model="formData.delivery" />
      </el-form-item>
      <el-form-item label="Activity type :">
        <el-checkbox-group v-model="formData.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources :">
        <el-radio-group v-model="formData.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form :">
        <el-input v-model="formData.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="basicForm">
import { ElMessage } from "element-plus";
import { reactive } from "vue";

// do not use same name with ref
const formData = reactive({
  name: "", // 名称
  region: "", // 地区
  date1: "", // 时间1
  date2: "", // 时间2
  delivery: false, // 开关
  type: [], // 复选框
  resource: "", // 单选框
  desc: "" // 文本域
});
const onSubmit = () => {
  console.log("表单值：", formData);
  console.log("表单值JSON：", JSON.stringify(formData));
  ElMessage.success("提交的数据为 : " + JSON.stringify(formData));
};
// 表单值：
// {
//     "name": "名称",
//     "region": "beijing",
//     "date1": "2023-05-09T16:00:00.000Z",
//     "date2": "2023-05-16T04:17:11.000Z",
//     "delivery": true,
//     "type": [
//         "Promotion activities",
//         "Offline activities",
//         "Simple brand exposure"
//     ],
//     "resource": "Venue",
//     "desc": "文本域"
// }
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
