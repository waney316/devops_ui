<template>
  <div class="app-containter">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>角色管理</span>
      </div>

      <div class="text item">
        <div class="filter-container">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style=" margin-right: 5px;"
            @click="handleCreate()"
            >新 建</el-button
          >
          <el-input
            v-model="listQuery.search"
            placeholder="请输入搜索角色"
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
        <el-table-column label="角色编号">
          <template slot-scope="{ row }">
            {{ row.id }}
          </template>
        </el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>
        <el-table-column label="备注信息">
          <template slot-scope="{ row }">
            {{ row.remarks }}
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
        @pagination="roleList"
      />
    </el-card>

    <!-- 更新和新增弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input
                v-model="dataForm.name"
                placeholder="请输入角色名"
                size="mini"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input
                v-model="dataForm.remarks"
                placeholder="备注"
                size="mini"
                type="text"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
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
  </div>
</template>

<script>
import {
  getRoleList,
  createRole,
  deleteRole,
  updateRole
} from "@/api/system/role";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  data() {
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
      dialogStatus: "",
      textMap: {
        update: "编辑用户",
        create: "新建用户"
      },
      rules: [],
      dataForm: {},
      rules: {
        name: { required: true, message: "角色名称", trigger: "blur" }
      },
      roles: []
    };
  },
  created() {
    this.roleList();
  },
  mounted() {},
  methods: {
    // 获取角色列表
    roleList() {
      getRoleList().then(response => {
        if (response.code === 0) {
          this.list = response.data.results;
          this.total = response.data.count;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCreate() {
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
      this.dataForm = {};
      // 重置校验规则
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleSelect(row) {
      console.log(row);
      // this.$router.push({ path: `/system/user/details` })
    },
    handleDelete(row, index) {
      this.$confirm("是否删除该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(row.id).then(response => {
            if (response.code === 0) {
              this.userList();
              this.$notify({
                title: "成功",
                message: response.message,
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: response.message,
                type: "error",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.userList();
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          delete this.dataForm.checkPassword;
          createUser(this.dataForm).then(response => {
            if (response.code === 0) {
              this.userList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.message,
                type: "success",
                duration: 2000
              });
            } else {
              this.dialogFormVisible = false;
              this.$notify({
                title: "失败",
                message: response.message,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.dataForm);
          delete tempData.avator;
          updateUser(this.dataForm.id, tempData).then(response => {
            if (response.code === 0) {
              this.userList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.message,
                type: "success",
                duration: 2000
              });
            } else {
              this.dialogFormVisible = false;
              this.$notify({
                title: "失败",
                message: response.message,
                type: "error",
                duration: 2000
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置用户密码和密码长度校验
    validatePassword(value) {
      return !(value.length < 4);
    },
    handleResetPass(row) {
      this.$prompt(`请输入 "${row.username}" 密码 `, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "password",
        inputValidator: this.validatePassword,
        inputErrorMessage: "密码长度至少为4位"
      })
        .then(({ value }) => {
          var resetPassForm = {
            username: row.username,
            password: value
          };
          updateUser(row.id, resetPassForm).then(response => {
            if (response.code === 0) {
              this.$message({
                type: "success",
                message: `更新用户 ${row.username} 密码为 ${value}`,
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    }
  }
};
</script>

<style scoped lang="less"></style>
