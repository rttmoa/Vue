<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">

      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <!-- 前面内容 -->
        <template v-slot:before>有 {{ attendInfo.tobeTaskCount }} 条考勤审批尚未处理</template>
        <!-- —————— 右侧跳转页 -->
        <template v-slot:after>
          <el-button size="mini" type="danger" @click="$router.push('/import?type=attendance')">导入</el-button>
          <el-button size="mini" type="warning" @click="tipsDialogVisible = true || handleTip">提醒Dialog</el-button>
          <el-button size="mini" type="primary" @click="handleSet">设置Dialog</el-button>
          <el-button size="mini" type="default" @click="$router.push('/attendances/archiving/')">历史归档</el-button>
          <el-button size="mini" type="primary" @click="$router.push({'path':'/attendances/report/'+ yearMonth})">{{ yearMonth }}报表</el-button>
        </template>
      </page-tools>

      <!-- 渲染 ———— 部门和考勤状态(复选框+单选框) -->
      <el-card class="hr-block">
        <el-form ref="formData" :model="formData" label-width="120px" class="formInfo">
          <el-form-item label="部门:" prop="dept">
            <el-checkbox-group v-model="formData.deptID">
              <el-checkbox v-for="item in departments" :key="item.id" :label="item.name">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="考勤状态：" prop="state">
            <el-radio-group v-model="formData.stateID">
              <el-radio v-for="item in stateData.holidayType" :key="item.id" :label="item.value" :value="item.value">
                {{ item.value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button type="primary"  @click="submitFormData">提交</el-button>
        </el-form>
      </el-card>

      <!-- 渲染 ———— 考勤数据 -->
      <el-card class="hr-block">
        <!-- 考勤列表 -->
        <div style="width:100%; position: relative; overflow-x: auto; overflow-y: hidden;">
          <div style="width: 3000px;">
            <table border="0" align="center" cellpadding="0" cellspacing="0" class="tableInfo">
              <tr>
                <th width="50">序号</th>
                <th width="100">姓名</th>
                <th width="100">工号</th>
                <th width="200">部门</th>
                <th width="100">手机</th>
                <th v-for="(it, ind) in monthOfReport" :key="ind" width="110">{{ attendInfo.month }}/{{ ind + 1 }}</th>
              </tr>
              <tr v-for="(item, index) in list" :key="item.id">
                <td width="50">{{ index }}</td>
                <td width="100">{{ item.username }}</td>
                <td width="100">{{ item.workNumber }}</td>
                <td width="200">{{ item.departmentName }}</td>
                <td width="150">{{ item.mobile }}</td>
                <!--  ———— 点击表格可修改考勤状态 -->
                <td
                  v-for="(it,ind) in item.attendanceRecord"
                  :key="ind"
                  width="110"
                  @click="showChangeDialog(item, ind, it)"
                >
                  <span v-if="it.adtStatu===1">√</span>
                  <span v-if="it.adtStatu===2">旷工</span>
                  <span v-if="it.adtStatu===3">迟到</span>
                  <span v-if="it.adtStatu===4">早退</span>
                  <span v-if="it.adtStatu===5">外出</span>
                  <span v-if="it.adtStatu===6">出差</span>
                  <span v-if="it.adtStatu===7">年假</span>
                  <span v-if="it.adtStatu===8">事假</span>
                  <span v-if="it.adtStatu===9">病假</span>
                  <span v-if="it.adtStatu===10">婚假</span>
                  <span v-if="it.adtStatu===11">丧假</span>
                  <span v-if="it.adtStatu===12">产假</span>
                  <span v-if="it.adtStatu===13">奖励产假</span>
                  <span v-if="it.adtStatu===14">陪产假</span>
                  <span v-if="it.adtStatu===15">探亲假</span>
                  <span v-if="it.adtStatu===16">工伤假</span>
                  <span v-if="it.adtStatu===17">调休</span>
                  <span v-if="it.adtStatu===18">产检假</span>
                  <span v-if="it.adtStatu===19">流产假2</span>
                  <span v-if="it.adtStatu===20">长期病假</span>
                  <span v-if="it.adtStatu===21">测试架</span>
                  <span v-if="it.adtStatu===22">补签</span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- 考勤状态 弹出框 修改状态 -->
        <el-dialog :visible.sync="centerDialogVisible" width="30%" center>
          <span slot="title" style="color:#fff;">{{ attendInfo.name }} {{ attendInfo.month }}/{{ attendInfo.getDate }}（实际工作日考勤方案）</span>
          <div class="attenInfo">
            <p class="colRed">注：统计考勤时，异常状态优先正常状态</p>
            <p class="check">
              <el-radio-group v-model="modifyData.adtStatu">
                <el-radio
                  v-for="item in stateData.vacationtype"
                  :key="item.id"
                  :label="item.id"
                  :value="item.name"
                >{{ item.name }}</el-radio>
              </el-radio-group></p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="btnOK">确定</el-button>
            <el-button @click="centerDialogVisible = false">取消</el-button>
          </span>
        </el-dialog>

        <!-- 分页组件 -->
        <el-row type="flex" align="middle" justify="center" style="height: 60px">
          <el-pagination
            :page-size="page.pagesize"
            :current-page="page.page"
            layout="prev, pager, next"
            :total="page.total"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>

    </div>

    <el-card>
      <!-- 提醒  -->
      <el-dialog title="提醒" :visible.sync="tipsDialogVisible" width="280px" center>
        <div class="attenInfo">
          <p>系统将通过邮件与短信的形式，对全体员工中存在旷工的考勤进行提醒，该提醒每月仅可发送 1 次。</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSub">我知道了</el-button>
          <el-button @click="tipsDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>

      <!-- 设置  -->
      <attendance-set ref="set" @handleCloseModal="handleCloseModal" />
    </el-card>

  </div>
</template>





<script>
import attendanceApi from '@/api/constant/attendance'
import { getAttendancesList, updateAttendance } from '@/api/attendances'
import AttendanceSet from './components/attendance-set'
import { getDepartments } from '@/api/departments'
export default {
  name: 'Attendances',
  components: {
    AttendanceSet
  },
  data() {
    // console.log(attendanceApi) // 自定义数组 ———— 假期类型，请假类型，部门类型...
    // console.log(this.formData)
    return {
      list: [],  // 考勤列表数据
      selectData: [],
      stateData: attendanceApi, // 考勤状态(单选框) - 固定值
      departments: [],          // 部门数据(复选框)
      total: 100,
      attendanceRecord: '',     // 弹出框修改考勤状态
      monthOfReport: '',  // 表头 三月份
      centerDialogVisible: false, // 关闭弹出框
      tipsDialogVisible: false, // 提醒组件是否显示
      month: '',
      yearMonth: '',
      loading: false, // 此页面的加载事件
      attendInfo: { // 考勤信息数据
        month: '',
        getDate: '',
        getInfo: '',
        name: '',
        counts: '',
        tobeTaskCount: ''
      },
      formData: {   // 改变的表单事件
        page: 1,
        pagesize: 10,
        keyword: this.keyword,
        deptID: [], // 部门Id
        stateID: '' // 考勤Id
      },
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      modifyData: { // 修改的数据
        userId: '',
        day: '',
        adtStatu: ''
      }
    }
  },
  // 创建完毕状态
  created() {
    this.getAttendancesList() // 获取考勤列表
    this.getDepartments() // 获取部门数据
  },
  methods: {
    // 部门和考勤状态的数据
    submitFormData() {
      console.log(this.$refs.formData.prop)
    },
    // 提醒Dialog
    handleSub() {
      this.tipsDialogVisible = false
      this.$message.success('提醒成功')
    },
    handleTip() {
      this.tipsDialogVisible = true
    },
    // 设置
    handleSet() {
      console.log("开启设置弹出框")
      this.$refs.set.dialogFormV()
    },
    // 弹框关闭
    handleCloseModal() {
      console.log("关闭设置弹出框")
      this.$refs.set.dialogFormH()
    },
    // 获取部门数据
    async getDepartments() {
      // console.log(await getDepartments()) // {companyId: '1', companyName: '江苏传智播客教育科技股份有限公司', companyManage: '', depts: Array(15)}
      const { depts } = await getDepartments()
      this.departments = depts
    },

    // TODO: 获取考勤列表
    async getAttendancesList() {
      // console.log("考勤列表i", await getAttendancesList({ ...this.page }))
      this.loading = true
      const { data, monthOfReport, tobeTaskCount } = await getAttendancesList({ ...this.page })
      this.list = data.rows // 员工数据
      this.page.total = data.total // 总条数
      this.attendInfo.counts = data.total // 总条数
      this.attendInfo.month = monthOfReport // 3
      this.attendInfo.tobeTaskCount = tobeTaskCount // 0

      var date = new Date()
      var year = date.getFullYear()
      const month = monthOfReport
      var d = new Date(year, month, 0) // 获取月份
      this.monthOfReport = d.getDate() // 获取日期
      this.yearMonth = year + ('' + month < 10 ? '0' + month : month)
      this.month = monthOfReport
      this.loading = false
    },
    // 更新Table中的考勤状态 (旷工 -> 迟到...)
    async btnOK() {
      console.log("modifyData", this.modifyData)
      console.log("modifyData.adtStatu", this.modifyData.adtStatu)
      // await updateAttendance(this.modifyData)  /* 注释 ——————   不可修改 */
      this.centerDialogVisible = false
      this.getAttendancesList() // 成功之后 重新拉取数据
    },
    // 页码改变
    pageChange(page) {
      this.page.page = page
      this.getAttendancesList() // 获取数据
    },
    // 弹出框修改考勤状态组件
    showChangeDialog(item, id, it) {
      // console.log(this.modifyData)
      this.modifyData.userId = item.id
      this.modifyData.day = it.day
      this.modifyData.departmentId = item.departmentId
      this.modifyData.adtStatu = it.adtStatu + '';   // 数字转成字符串
      // console.log(this.modifyData)
      if (it.adtStatu !== '') {
        this.attendInfo.getDate = parseInt(id + 1)
        this.attendInfo.getInfo = it.adtStatu
        this.attendInfo.name = item.name
        this.centerDialogVisible = true
      }
    }
  }
}
</script>




<style rel="stylesheet/scss" lang="scss" scoped>
  .tableInfo {
    line-height: 36px;
    border: solid 1px #ebeef5;
    border-right: 0 none;
    border-bottom: 0 none;
    tr {
      th {
        height: 50px;
        text-align: center;
        border-right: solid 1px #ebeef5;
        border-bottom: solid 1px #ebeef5;
        border-bottom: 2px solid #e8e8e8;
        background: #fafafa;
        min-width:  100px;
      }
      td {
        height: 36px;
        text-align: center;
        border-right: solid 1px #ebeef5;
        border-bottom: solid 1px #ebeef5;
      }
    }
  }

.attenInfo {
  p {
    &.check {
      padding: 20px 0 0;
    }
    .el-radio {
        display: inline-block;
        width: 60px;
        padding: 5px 0;

    }
  }
}
</style>
