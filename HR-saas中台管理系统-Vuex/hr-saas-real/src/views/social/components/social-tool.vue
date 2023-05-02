<template>
  <div class="cont-top-box">
    <h3>此筛选组件（点击复选框可直接搜索内容）</h3>

    <el-form label-width="100px">
      <el-form-item label="部门">
        <el-checkbox-group v-model="departmentChecks" style="display:inline-block">
          <el-checkbox v-for="item in departmentList" :key="item.id" :label="item.id" @change="checkChange">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="社保城市">
        <el-checkbox-group v-model="socialSecurityChecks" style="display:inline-block">
          <el-checkbox v-for="item in cityList" :key="item.id" :label="item.id" @change="checkChange">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="公积金城市">
        <el-checkbox-group v-model="providentFundChecks" style="display:inline-block">
          <el-checkbox v-for="item in cityList" :key="item.id" :label="item.id" @change="checkChange">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

  </div>
</template>






<script>
import { getCityList } from '@/api/common'
import { getDepartments } from '@/api/departments'

export default {
  name: 'SocialTool',
  data() {
    return {
      tips: {},
      keyword: '',
      departmentChecks: [],     // 点击部门的Id
      socialSecurityChecks: [], // 点击社保城市的Id
      providentFundChecks: [],  // 点击公积金城市的Id
      cityList: [],       // 筛选下：社保城市/公积金城市
      departmentList: []  // 筛选下：部门
    }
  },
  created: function() {
    this.getCityList()
    this.getDepartments()
  },
  methods: {
    // 获取城市
    async getCityList() {
      this.cityList = await getCityList()
    },
    // 获取组织架构
    async getDepartments() {
      const { depts } = await getDepartments()
      this.departmentList = depts
    },
    checkChange() {
      // console.log("checkChange", this.socialSecurityChecks) // ['1084825908823904256', __ob__: Observer]
      // console.log("checkChange", this.departmentChecks) // (3) ['1175311213774962688', '1235398708763762688', '1235398917619130368', __ob__: Observer]
      const selectParams = {
        'departmentChecks': this.departmentChecks,
        'socialSecurityChecks': this.socialSecurityChecks,
        'providentFundChecks': this.providentFundChecks
      }
      this.$parent.changeSelectParams && this.$parent.changeSelectParams(selectParams) // TODO: 调用父组件的函数
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cont-top-box {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

</style>
