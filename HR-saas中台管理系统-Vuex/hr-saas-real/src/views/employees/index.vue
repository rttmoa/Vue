<template>
  <div class="dashboard-container">
    <div class="app-container">

      <page-tools :show-before="true">
        <!-- 插槽 -->
        <!-- <template slot="after"> -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录 </span>
          <span> -- 操作->查看</span>
        </template>
        <!-- v-bind: => :  v-on: => @  v-slot:  => # -->
        <!-- TODO: 表头按钮 -->
        <template #after>
          <el-button size="small" type="danger" @click="exportData">普通excel导出</el-button>
          <el-button size="small" type="info" @click="exportMutiData">复杂表头excel导出</el-button>
          <el-button size="small" type="success" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>


      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" :data="list" border stripe>
          <el-table-column align="center" type="index" label="序号" sortable width="80" />
          <el-table-column align="center" prop="username" label="姓名" sortable />
          <el-table-column label="头像" align="center">
            <!-- FIXME: 自定义内容 -->
            <template slot-scope="{ row }">
              <img
                v-imageerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatEmployment" sortable />
          <el-table-column prop="departmentName" label="部门" sortable />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable>
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="状态" sortable>
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="large" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small" disabled>转正</el-button>
              <el-button type="text" size="small" disabled>调岗</el-button>
              <el-button type="text" size="small" disabled>离职</el-button>
              <el-button type="text" size="large" @click="assignRole(row.id)">角色</el-button>
              <el-button type="text" size="large" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination
            :total="page.total"
            :page-size="page.size"
            :current-page.sync="page.page"
            layout="total, prev,pager, next"
            @current-change="getEmployeeList"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 使用组件 -->
    <!-- 这里为什么可以用sync 因为后面的变量是来源于data -->
    <!-- 子组件 this.$emit("update:showDialog", false) -->
    <!-- TODO: 按钮：新增员工 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- TODO: 操作：角色：分配角色 弹窗 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    <!-- TODO: 点击头像，弹出二维码 -->
    <el-dialog title="图片二维码" :visible.sync="showCodeDialog">
      <!-- 放置canvas -->
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

  </div>
</template>






<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      showDialog: false,     // 弹窗：新增员工
      showCodeDialog: false, // 弹窗：头像二维码
      showRoleDialog: false, // 弹窗：分配角色
      userId: null, // 记录当前点击的id
      loading: false, // 控制table表格的加载
      page: {
        total: 0,
        page: 1,
        size: 10
      },
      list: []
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // Table 格式化聘用形式的属性方法
    formatEmployment(row, column, cellValue, index) {
      // console.log(cellValue) // 1
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
      // cellValue是当前单元格的值
      // row 是当前行的数据的对象
    },
    // Table 操作 删除用户
    delEmployee(id) {
      this.$confirm('确定删除该用户？').then(() => {
        return delEmployee(id)
      }).then(() => {
        this.$message.success('删除用户成功')
        this.getEmployeeList()
      })
    },
    // 按钮：普通excel导出
    exportData() {
      // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的员工列表数据
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // rows是所有的员工列表数据
        // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]

        // excel导出的默认对象
        excel.export_json_to_excel({
          filename: '人力资源表',
          header: Object.keys(headers),
          data: this.formatJSON(headers, rows)
        })
      })
    },
    // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]
    // 数据的顺序是按照headers中key的顺序来的
    // 格式化json数据
    formatJSON(headers, rows) {
      // rows 是一行一行的  =>  [{},{}] => [[],[]]
      return rows.map(item => {
        // item {username: '张三', mobile: 123}  现在是对象 => []
        // ["姓名","手机号"] => [ '张三', '123']
        return Object.keys(headers).map(key => {
          // key是中文 headers[key]是英文 // item是 英文 {username: '张三', mobile: 123}
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 如果是日期的话 就需要格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 要把聘用形式转化成文本
            const obj = EmployeeEnum.hireType.find(o => o.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    // 按钮：复杂表头excel导出
    exportMutiData() {
      // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的员工列表数据
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // rows是所有的员工列表数据
        // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]

        // excel导出的默认对象
        excel.export_json_to_excel({
          filename: '人力资源表',
          header: Object.keys(headers),
          // mutiHeader中表头的长度必须和header的表头长度是对应的 否则报错
          multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']], // 复杂表头的导出 数组中的一个数组 就是一行表头
          data: this.formatJSON(headers, rows),
          merges: ['A1:A2', 'B1:F1', 'G1:G2'] // 合并列  不用区分顺序 只写合并的单元格的顺序号
        })
      })
    },
    // Table 头像：显示二维码方法
    showQrCode(url) {
      // console.log(url) // http://q6cu3t6jv.bkt.clouddn.com/1063705989926227968?t=1582797590950
      if (url && url.trim()) {
        this.showCodeDialog = true;  // 让 dialog 组件显示
        // 页面的渲染是异步的  状态变了 页面会立刻变化吗  页面立刻能得到dom？  ！！！ no
        // nextTick总是会等到当前的数据更新完毕 并且渲染完毕之后 执行

        // setTimeout(,0) 异步函数总是等到同步代码执行完毕
        // this.$nextTick 和 Vue.nextTick()
        this.$nextTick(() => {
          // 此时该函数执行时 一定是上一次的更新执行完毕了
          // 此时一定能保证拿到canvas
          QrCode.toCanvas(this.$refs.myCanvas, url) // FIXME: 转化二维码 - canvas ref=myCanvas
        })
      } else {
        this.$message.warning('当前用户没有头像')
      }
    },
    // Table 操作：分配角色
    async assignRole(id) {
      this.userId = id // 记住当前点击的user-id  props传值是异步的 props异步渲染传值
      // 同步和异步相遇  会先执行同步
      // 立刻调用获取数据的方法
      await this.$refs.assignRole.getUserDetailById(id) // FIXME: 去调用 子组件中的方法
      this.showRoleDialog = true
    }
    // changePage(newPage) {
    //   this.page.page = newPage
    //   this.getEmployeeList()
    // }
  }
}
</script>

<style>

</style>
