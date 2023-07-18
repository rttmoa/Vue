<!-- TODO: 公司设置 (树结构) -->
<template>
  <div class="dashboard-container">

    <div class="app-container">
      <!-- FIXME: 公司页面结构  （ Tab1角色管理 + Tab2公司信息 ） -->
      <el-tabs>
        <el-tab-pane label="角色管理">
          <el-row style="height: 60px">
            <el-button type="primary" size="small" @click="showDialog = true">新增角色</el-button>
          </el-row>
          <el-table stripe border="" :data="list">
            <el-table-column label="序号" width="120" type="index" align="center" />
            <el-table-column label="角色" prop="name" width="240" align="center" />
            <el-table-column label="描述" prop="description" align="center" />
            <el-table-column label="操作" align="center">
              <!-- v-slot 必须用到template标签上 -->
              <!-- <template slot-scope="{ row }"> -->
              <template v-slot="{ row }">
                <el-button size="small" type="success" @click="assignRole(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 放置分页 -->
          <el-row type="flex" justify="end" style="height: 60px" align="middle">
            <!-- this.$emit("update: current-page", newPage) -->
            <el-pagination
              :total="page.total"
              :page-size="page.pagesize"
              :current-page.sync="page.page"
              layout="prev, pager, next"
              @current-change="getRoleList"
            />
          </el-row>
          <!-- FIXME: alert -->
          <el-alert type="warning" title="分配权限 树结构 && 新增/编辑角色信息" show-icon :closable="false" />
        </el-tab-pane>
        <el-tab-pane label="公司信息">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="true"
          />
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="formData.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input v-model="formData.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                :rows="3"
                disabled
                style="width:400px"
              />
            </el-form-item>
            <el-form-item label="备注22_test">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                :rows="3"
                style="width:400px"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 弹层组件 -->
    <!-- this.$emit("update: visible", false) -->
    <el-dialog title="编辑角色" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- slot="footer" -->
      <template v-slot:footer>
        <el-row type="flex" justify="center">
          <!--放置列 -->
          <el-col :span="8">
            <el-button @click="btnCancel">取消</el-button>
            <el-button type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>

    <!-- 放置一个分配权限的弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- node-key指定当前节点数据中的唯一标识字段 -->
      <!-- check-strictly如果为true 标识不关联 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        default-expand-all=""
        show-checkbox
        :default-checked-keys="selectChecks"
        :check-strictly="true"
        node-key="id"
      />
      <!-- 确定和取消按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>



<!-- TODO: 公司设置： http://localhost:8888/hrsaas/setting -->
<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [],  // 获取的角色管理数据
      page: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      formData: {}, // 公司信息数据
      roleForm: {}, // 新增/编辑角色信息
      rules: { name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }] },
      showDialog: false,  // 是否显示弹出框
      showPermDialog: false, // 是否显示分配权限弹出框
      roleId: null, // 记录当前点击分分配权限的角色id
      permData: [], // 专门来接收权限数据
      defaultProps: {
        label: 'name'
      },
      selectChecks: [] // 用来接收当前角色所拥有的权限数据
    }
  },
  // 计算
  computed: {
    ...mapGetters(['companyId']) // FIXME: ...mapGetters(['companyId']) 等同于 this.$store.getters[`companyId`]
  },
  // 创建
  created() {
    this.getRoleList()    // 获取角色数据
    this.getCompanyInfo() // 获取公司数据
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      // debugger
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      // console.log(this.companyId === this.$store.getters.companyId) // true
      this.formData = await getCompanyInfo(this.companyId)
    },
    async delRole(id) {
      try {
        await this.$confirm('确定删除此角色？')
        await deleteRole(id)
        this.getRoleList()
      } catch (error) {
        console.error("catch e", error)
      }
    },
    // 编辑按钮
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // FIXME: 当编辑时，获取角色信息赋值给 roleForm 用
      this.showDialog = true
    },
    // 提交按钮 （添加 / 编辑角色）
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
          this.showDialog = false
        } else {
          await addRole(this.roleForm)
          this.showDialog = false
        }
        this.getRoleList()
      } catch (error) {
        this.showDialog = false
      }
    },
    btnCancel() {
      // 重置数据
      this.roleForm = {}
      // 重置表单值
      this.$refs.roleForm.resetFields()
      this.showDialog = false;
    },
    // TODO: 分配权限  （树结构 /utils/indexjs ）
    async assignRole(id) {
      this.roleId = id;
      this.permData = transListToTreeData(await getPermissionList(), '0') // 将树形转化
      const { permIds } = await getRoleDetail(id) // permIds就是当前点击的角色的权限数据
      // console.log('permIds', permIds) // (2) ['604f7e79f900be1850edb158', '604f7df5f900be1850edb152']
      // console.log('this.permData', this.permData) // (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…},]
      this.selectChecks = permIds
      this.showPermDialog = true;
    },
    // 分配权限Dilog确定按钮
    async btnPermOK() {
      // console.log(this.$refs.permTree) // VueComponent {_uid: 898, _isVue: true, $options: {…}, _renderProxy: Proxy(VueComponent), _self: VueComponent, …}
      // console.log(this.$refs.permTree.getCheckedKeys()) // ['604f7df5f900be1850edb152', '604f7e07f900be1850edb153', '604f7e79f900be1850edb158']
      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() });
      this.$message.success('分配权限成功');
      this.showPermDialog = false;
    },
    // 分配权限关闭 + 关闭选择的树结构 + 关闭弹窗
    btnPermCancel () {
      this.selectChecks = [];
      this.showPermDialog = false;
    }
  }
}
</script>

<style></style>
