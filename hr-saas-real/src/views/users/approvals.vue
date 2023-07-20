<!-- TODO: 首页 -> 审批列表 -> http://localhost:8888/hrsaas/users/approvals  -->
<template>
  <div class="usersApprovalsContainer">

    <div class="approvalsTop">
      <el-tabs v-model="tagName" @tab-click="tabSwitch">
        <el-tab-pane label="全部" name="copy" />
        <el-tab-pane label="我发起的" name="launch" />
        <el-tab-pane label="待审批" name="approvals" />
      </el-tabs>
    </div>

    <div class="approvalsContent">
      <!-- FIXME: 审批类型 && 审批状态 （表头筛选状态） -->
      <div class="topTitle">
        <div>
          <span>审批类型：</span>
          <el-radio-group v-model="approvalsTypes" style="margin:5px 0">
            <el-radio
              v-for="item in approvalsType"
              :key="item.deploymentId"
              :label="item.key"
              :value="item.key"
              @change="changeSelectParams"
            >{{ item.name }}</el-radio>
          </el-radio-group>
        </div>
        <div v-if="tagName != 'approvals'">
          <span>审批状态：</span>
          <el-checkbox-group v-model="approvalsStates">
            <el-checkbox
              v-for="item in approvalsState"
              :key="item.id"
              :label="item.id"
              :value="item.id"
              @change="changeSelectParams"
            >{{ item.value }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div>
        <!-- 排序组件需要 设置列的prop 和 sortable 才能使得默认的排序生效 -->
        <el-table :data="tableData" style="width: 100%" :default-sort="{order: 'descending', prop: 'procApplyTime'}">
          <el-table-column type="selection" width="28" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="processName" label="审批类型" />
          <el-table-column v-if="tagName!=='launch'" prop="username" label="申请人" />
          <el-table-column v-if="tagName!=='approvals'" prop="procCurrNodeUserName" label="当前审批人" />
          <el-table-column label="申请时间" sortable prop="procApplyTime">
            <template slot-scope="scope">
              <span>{{ scope.row.procApplyTime | formatDate }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="最后操作时间" v-if='tabLab!=="launch"'>
            <template slot-scope="scope"><span>{{scope.row.proc_last_node_time | formatDate}}</span></template>
          </el-table-column> -->
          <el-table-column label="审批状态">
            <template slot-scope="scope">
              <span v-if="scope.row.processState==='0'" class="rovalsState">
                <em class="sub" />已提交
              </span>
              <span v-if="scope.row.processState==='1'" class="rovalsState">
                <em class="stay" />审批中
              </span>
              <span v-if="scope.row.processState==='2'" class="rovalsState">
                <em class="adopt" />审批通过
              </span>
              <span v-if="scope.row.processState==='3'" class="rovalsState">
                <em class="reject" />审批不通过
              </span>
              <span v-if="scope.row.processState==='4'" class="rovalsState">
                <em class="revoke" />撤销
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
               <!-- && (item.row.stateOfApproval == '待审批' || item.row.stateOfApproval == '已驳回') -->
              <el-button v-show="(tagName == 'launch') && (scope.row.processState==='1')"
                size="large" type="text" @click="clickPass('4', scope.row.processId)"
              >
                撤销
              </el-button>
              <!--  && item.row.currentApproverId == userId -->
              <el-button v-show="(tagName == 'copy' || tagName == 'approvals') && (scope.row.processState==='1')"
                size="large" type="text" @click="clickPass('2', scope.row.processId)"
              >
                通过
              </el-button>
              <!--  && item.row.currentApproverId == userId -->
              <el-button v-show="(tagName == 'copy' || tagName == 'approvals') && (scope.row.processState==='1')"
                size="large" type="text" @click="clickPass('3', scope.row.processId)"
              >
                驳回
              </el-button>
              <el-button size="large" type="text" @click="clickDetail(scope.row.processId, scope.row.processName)">
                查看
              </el-button>
              <!-- <el-button size="large" type="danger">打印</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-row type="flex" justify="center" style="height: 60px" align="middle">
          <el-pagination
            :total="Number(total)"
            :page-sizes="[5, 10, 20, 30, 50]"
            layout="prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </div>
    </div>

    <!-- TODO: 弹窗显示内容为：审批类型(离职/加班/请假) + 操作查看 -->
    <el-dialog :title="topLabel" :visible.sync="centerDialogVisible" width="50%" left>
      <!-- <BecomeARegularWorker v-show="seeState == 'becomeARegularWorker'" /> -->
      <!-- <AdjustThePost v-show="seeState == 'adjustThePost'" /> -->
      <!-- TODO: 审批类型为离职 -->
      <Quit
        v-show="seeState == 'quit'"
        ref="quit"
        :selected-id="selectedId"
        :tab-lab="tagName"
        @closeDialog="closeDialog"
      />
      <!-- <Examine v-show="seeState == 'examine'" /> -->
      <Leave
        v-show="seeState == 'leave'"
        ref="leave"
        :selected-id="selectedId"
        :tab-lab="tagName"
        @closeDialog="closeDialog"
      />
      <Overtime
        v-show="seeState == 'overtime'"
        ref="overtime"
        :selected-id="selectedId"
        :tab-lab="tagName"
        @closeDialog="closeDialog"
      />
      <!-- <Employment v-show="seeState == 'employment'" /> -->
    </el-dialog>

    <!-- 通过审核 Dialog -->
    <el-dialog  title="通过审核" :visible.sync="adoptVisible" width="30%" :before-close="handleClose">
      <span><el-input v-model="formData.handleOpinion" type="textarea" /></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adoptVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProcess">确认</el-button>
      </span>
    </el-dialog>
    <!-- end -->
  </div>
</template>






<script>
import {  getApprovalList,  approvalsDel,  approvalsPass,  approvalsReject,  getFlowList  } from '@/api/approvals'
import baseApi from '@/api/constant/approvals'
import Quit from './components/quit'
import Leave from './components/leave-job'
import Overtime from './components/overtime'
import { mapGetters } from 'vuex'
export default {
  name: 'UsersTableIndex',
  // TODO: 封装组价： quit、leave-job、overtime
  components: {
    // 离职
    Quit,
    // 请假、调休
    Leave,
    // 加班
    Overtime
  },
  data() {
    return {
      // 标签名
      tagName: 'copy',
      // 查看状态：调岗、离职、审核、加班、录用、请假、调休、转正
      seeState: 'becomeARegularWorker',
      centerDialogVisible: false,
      topLabel: '转正',
      // 审批类型选中值（单选框）
      approvalsTypes: '',
      // 审批类型接口数据（单选框）
      approvalsType: [],
      // 审批状态接口数据（复选框）
      approvalsState: baseApi.approvalState,
      // 审批状态选中值（复选框）
      approvalsStates: [],
      tableData: [],
      page: null,
      pageSize: null,
      total: '',
      selectedId: '',
      // 页码信息：
      pagination: {
        page: 1,
        pageSize: 10,
        process_key$equal: this.process_key$equal,
        process_state$in: this.process_state$in
        // proc_apply_user_id$equal:''
      },
      // 审核 Dialog
      adoptVisible: false,
      formData: {
        handleOpinion: '',
        processId: '',
        handleType: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created() {
    this.getApprovalList()  // 获取审批数据
    this.getFlowList()      // 获取流程数据
  },
  methods: {
    // api 审批数据 （表格中的数据内容）
    async getApprovalList() {
      const result = await getApprovalList(this.pagination)
      this.total = result.total
      this.tableData = result.rows
      // console.log(await getApprovalList(this.pagination)) // 表格内容
    },
    // api 流程数据 （单选框中内容）
    async getFlowList() {
      this.approvalsType = await getFlowList()  // 离职 / 请假 / 加班
    },
    // 审核弹窗确定
    async handleProcess() {
      await approvalsPass(this.formData)
      this.$message.success('操作成功')
      this.getApprovalList()
      this.adoptVisible = false
    },
    // TODO: 切换Tabs： 全部 / 我发起的 / 待审批
    tabSwitch() {
      // 审批状态 和 程序状态
      this.approvalsStates = []
      this.pagination.processState = ''
      // let sendData = {};
      if (this.tagName === 'launch') { // 发起
        delete this.pagination.userId
        delete this.pagination.procCurrNodeUserId
        this.pagination.userId = this.userId
      } else if (this.tagName === 'approvals') { // 审批
        delete this.pagination.userId
        delete this.pagination.procCurrNodeUserId
        this.pagination.procCurrNodeUserId = this.userId
        this.pagination.processState = '1'
      } else if (this.tagName === 'copy') { // 全部
        delete this.pagination.userId
        delete this.pagination.procCurrNodeUserId
      }
      this.getApprovalList()
    },
    // TODO: 表头筛选条件（单选，复选框）
    changeSelectParams() {
      this.pagination.processKey = this.approvalsTypes
      this.pagination.processState = this.approvalsStates.join(',')
      // console.log('pagination', this.pagination)
      // this.pagination:  {page: 1, pageSize: 10, processKey: "process_leave", processState: "2,3", process_key$equal: undefined,}
      this.getApprovalList()
    },
    // TODO: 操作 - 查看按钮
    clickDetail(id, approvalType) {
      this.centerDialogVisible = true
      this.topLabel = approvalType
      switch (approvalType) {
        case '调岗':
          this.seeState = 'adjustThePost'
          break
        case '离职':
          this.seeState = 'quit'
          this.selectedId = id
          this.$refs.quit.updateData()
          break
        case '审核':
          this.seeState = 'examine'
          break
        case '加班':
          this.seeState = 'overtime'
          this.selectedId = id
          this.$refs.overtime.updateData()
          break
        case '录用':
          this.seeState = 'employment'
          break
        case '请假':
          this.seeState = 'leave'
          this.selectedId = id
          this.$refs.leave.updateData()
          break
        case '调休':
          this.seeState = 'leave'
          this.selectedId = id
          this.$refs.leave.updateData()
          break
        default:
          this.seeState = 'becomeARegularWorker'
          this.topLabel = '转正'
      }
    },
    // TODO: Table操作 - 撤销 / 通过 / 驳回按钮
    clickPass(num, id) {
      this.adoptVisible = true
      this.formData.processId = id
      if (num === '2') {
        this.formData.handleType = '2'
      } else if (num === '3') {
        this.formData.handleType = '3'
      } else if (num === '4') {
        this.formData.handleType = '4'
      }
      this.formData.handleUserId = this.userId
    },
    // 每页显示信息条数 （@size-change）
    handleSizeChange(pageSize) {
      this.pagination.pagesize = pageSize
      if (this.pagination.page === 1) {
        this.getApprovalList()
      }
    },
    // 进入某一页 （@current-change）
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getApprovalList()
    },

    async delProcess(id) {
      await approvalsDel({ id })
      this.$message.success('撤销成功')
      this.getApprovalList()
    },
    clickCancel(id) {
      this.$confirm('是否撤销该流程')
        .then(() => {
          this.delProcess(id)
        })
    },

    async rejectProcess(id) {
      await approvalsReject({ id })
      this.getApprovalList()
      this.$message.success('操作成功')
    },
    clickBack(id) {
      this.$confirm('是否驳回', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
          this.rejectProcess(id)
        })
    },
    // 关闭 自定义组件 按钮
    closeDialog() {
      this.centerDialogVisible = false
      this.getApprovalList()
    },
    // 审核弹窗 右上角x关闭时 提示是否关闭
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
.usersApprovalsContainer {
  padding: 20px;
  margin-top: 15px;
  .approvalsTop {
    color: #666;
    background: #fff;
    // border-bottom: solid 1px #ccc;
    line-height: 40px;
    span {
      display: inline-block;
      padding: 0 25px;
      font-size: 18px;
      cursor: pointer;
    }
    .act {
      color: $blue;
      border-bottom: solid 2px $blue;
    }
  }
  .approvalsContent {
    .topTitle {
      background: #fff;
      padding: 15px;
      div {
        margin: 15px 0;
        span {
          position: relative;
          top: 2px;
          float: left;
          font-weight: bold;
        }
      }
    }
    .el-dropdown-link {
      color: #666;
      border: solid 1px #ccc;
      display: inline-block;
      width: 67px;
      height: 28px;
      padding: 2px 10px;
      font-size: 12px;
      border-radius: 3px;
      margin-right: 5px;
    }
  }
}
.page-list {
  text-align: right;
  margin-top: 10px;
}
.el-textarea__inner{ // 然后找到对应的类名，在这里将拉伸去掉即可
  resize: none;
  }
</style>
