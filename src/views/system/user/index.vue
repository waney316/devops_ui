<template>
  <div class="app-containter">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>用户管理</span>
      </div>

      <div class="text item">
        <div class="filter-container">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style=" margin-right: 5px;"
            @click="handleCreate()"
          >新 建</el-button>
          <el-input
            v-model="listQuery.search"
            placeholder="请输入搜索用户"
            size="mini"
            style="width: 250px;"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleFilter"
            />
          </el-input>
        </div>
      </div>

      <el-table
        :key="tableKey"
        :v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        size="mini"
        style="width: 100%; margin-top: 10px;"
      >
        <el-table-column
          label="用户名"
          prop="username"
        />
        <el-table-column
          label="姓名"
          prop="name"
        />
        <el-table-column
          label="邮箱"
          prop="email"
        />
        <el-table-column
          label="是否管理员"
          prop="is_superuser"
        >
          <template slot-scope="{ row }">
            <el-tag
              v-if="row.is_superuser"
              size="mini"
              type="success"
            >是</el-tag>
            <el-tag
              v-else
              size="mini"
              type="danger"
            >否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="在职状态"
          prop="is_active"
        >
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.is_active"
              size="mini"
              disabled
            >否</el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="{ row }">
            {{ row.date_joined }}
          </template>
        </el-table-column>
        <el-table-column label="最近登录时间">
          <template slot-scope="{ row }">
            {{ row.last_login }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="260"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="handleSelect(row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="handleUpdate(row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(row, $index)"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="handleResetPass(row, $index)"
            >
              重置
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        style="float: right"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="userList"
      />
    </el-card>

    <!-- 更新和新增弹窗 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="用户名"
              prop="username"
            >
              <el-input
                v-model="dataForm.username"
                placeholder="请输入用户名"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="姓名"
              prop="name"
            >
              <el-input
                v-model="dataForm.name"
                placeholder="请输入姓名"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="dialogStatus === 'create'"
              label="密码"
              prop="password"
            >
              <el-input
                v-model="dataForm.password"
                placeholder="请输入密码"
                size="mini"
                type="password"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="dialogStatus === 'create'"
              label="确认密码"
              prop="checkPassword"
            >
              <el-input
                v-model="dataForm.checkPassword"
                placeholder="请输入确认密码"
                size="mini"
                type="password"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="邮箱"
              prop="email"
            >
              <el-input
                v-model="dataForm.email"
                placeholder="请输入邮箱"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="角色"
              prop="roles"
            >
              <el-select
                v-model="dataForm.roles"
                multiple
                filterable
                size="mini"
                style="width: 100%"
                placeholder="请选择角色"
              >
                <el-option
                  v-for="role in roles"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="手机号"
              prop="phone"
            >
              <el-input
                v-model="dataForm.phone"
                placeholder="请输入手机号"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="职位描述"
              prop="position"
            >
              <el-input
                v-model="dataForm.position"
                placeholder="请输入职位描述"
                size="mini"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="是否管理员"
              prop="is_superuser"
            >
              <el-radio-group
                v-model="dataForm.is_superuser"
                size="mini"
              >
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="dialogFormVisible = false"
        >
          关闭
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="用户详情"
      :visible.sync="dialogDetailVisible"
    >
      <el-form
        :model="Detailform"
        size="mini"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item
              label="ID"
              label-width="120"
            >
              <el-input
                v-model="Detailform.id"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="姓名"
              label-width="120"
            >
              <el-input
                v-model="Detailform.name"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="用户名"
              label-width="120"
            >
              <el-input
                v-model="Detailform.username"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item
              label="邮箱"
              label-width="120"
            >
              <el-input
                v-model="Detailform.email"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="手机"
              label-width="120"
            >
              <el-input
                v-model="Detailform.phone"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="职位"
              label-width="120"
            >
              <el-input
                v-model="Detailform.position"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogDetailVisible = false"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="dialogDetailVisible = false"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  createUser,
  deleteUser,
  updateUser
} from '@/api/system/user'
import { getRoleList } from '@/api/system/role'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  data () {
    // 前后密码校验
    const validateCheckPass = (rule, value, callback) => {
      if (value !== this.dataForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }

    return {
      list: [],
      tableKey: 0,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      listLoading: false,

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新建用户'
      },
      rules: [],
      dataForm: {},
      rules: {
        name: { required: true, message: '请输入姓名', trigger: 'blur' },
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, message: '至少大于4位', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { trigger: 'blur', validator: validateCheckPass }
        ],
        email: {
          type: 'email',
          required: true,
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change']
        },
        is_superuser: [
          { required: true, message: '请选择是否管理员', trigger: 'change' }
        ],
        roles: [{ required: true, message: '请选择角色', trigger: 'change' }],
        phone: [
          { min: 11, max: 11, message: '手机号必须为11位', trigger: 'blur' }
        ]
      },
      roles: [],

      dialogDetailVisible: false,
      Detailform: {}
    }
  },
  created () {
    this.userList()
    this.roleList()
  },
  mounted () { },
  methods: {
    // 获取用户列表
    userList () {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.results
        this.total = response.data.count
        this.listLoading = false
      })
    },
    // 获取角色列表
    roleList () {
      getRoleList().then(response => {
        if (response.code === 0) {
          this.roles = response.data.results
        }
      })
    },

    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.dataForm = {}
      // 重置校验规则
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSelect (row) {
      console.log(row)
      // this.$router.push({ path: `/system/user/details` });
      this.Detailform = Object.assign({}, row)
      this.dialogDetailVisible = true
    },
    handleDelete (row, index) {
      this.$confirm('是否删除该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(row.id).then(response => {
            if (response.code === 0) {
              this.userList()
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleUpdate (row) {
      this.dataForm = Object.assign({}, row)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.userList()
    },
    createData () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          delete this.dataForm.checkPassword
          createUser(this.dataForm).then(response => {
            if (response.code === 0) {
              this.userList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
            } else {
              this.dialogFormVisible = false
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateData () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.dataForm)
          delete tempData.avator
          delete tempData.password
          updateUser(this.dataForm.id, tempData).then(response => {
            if (response.code === 0) {
              this.userList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
            } else {
              this.dialogFormVisible = false
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置用户密码和密码长度校验
    validatePassword (value) {
      return !(value.length < 4)
    },
    handleResetPass (row) {
      this.$prompt(`请输入 "${row.username}" 密码 `, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputValidator: this.validatePassword,
        inputErrorMessage: '密码长度至少为4位'
      })
        .then(({ value }) => {
          var resetPassForm = {
            username: row.username,
            password: value
          }
          updateUser(row.id, resetPassForm).then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: `更新用户 ${row.username} 密码为 ${value}`,
                duration: 2000
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    }
  }
}
</script>

<style scoped lang="less"></style>
