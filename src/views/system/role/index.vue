<template>
  <div class="app-containter">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>角色管理</span>
      </div>

      <div class="text item">
        <div class="filter-container">
          <el-button
            v-permisaction="['system:role:create']"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style=" margin-right: 5px;"
            @click="handleCreate()"
            >新 建</el-button
          >
          <el-input
            v-model="listQuery.search"
            placeholder="请输入角色名称或权限标识"
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
        <el-table-column label="角色编号" width="80" align="center">
          <template slot-scope="{ row }">
            {{ row.id }}
          </template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column label="角色权限标识" align="center">
          <template slot-scope="{ row }">
            {{ row.key }}
          </template>
        </el-table-column>
        <el-table-column label="显示顺序" align="center">
          <template slot-scope="{ row }">
            {{ row.sort }}
          </template>
        </el-table-column>

        <el-table-column label="备注信息" min-width="160" align="center">
          <template slot-scope="{ row }">
            {{ row.remarks }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="280"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              v-permisaction="['system:role:edit']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="handleUpdate(row)"
            >
              编辑
            </el-button>
            <el-button
              v-permisaction="['system:role:delete']"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(row, $index)"
            >
              删除
            </el-button>
            <el-button
              v-permisaction="['system:role:permission:edit']"
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="handlePermission(row, $index)"
            >
              权限
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

    <!-- 角色编辑 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="dataForm.name"
            placeholder="请输入角色名"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="权限标识" prop="key">
          <el-input
            v-model="dataForm.key"
            placeholder="请输入角色权限标识"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="dataForm.sort" :min="0" label="描述文字" />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="dataForm.remarks"
            placeholder="备注"
            size="mini"
            :rows="2"
            type="textarea"
          />
        </el-form-item>
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

    <!-- 角色权限 -->
    <el-dialog title="角色权限" :visible.sync="dialogPermVisible" width="35%">
      <el-input
        v-model="filterText"
        placeholder="请输入权限名称"
        class="input-with-select"
        size="small"
        style="margin-bottom: 20px"
      >
        <el-button slot="append" icon="el-icon-search" />
      </el-input>

      <el-tree
        ref="tree"
        class="filter-tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        highlight-current
        :default-expanded-keys="[0, 1]"
        :props="defaultProps"
        :filter-node-method="filterNode"
      />

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogPermVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" @click="updatePermission()"
          >确 定</el-button
        >
      </span>
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

import { getPermissionTree } from "@/api/system/permission";
import { updateRolePermission } from "@/api/system/role";

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

      // 权限弹窗
      filterText: "",
      dialogPermVisible: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      currentRole: {},

      textMap: {
        update: "编辑角色",
        create: "新建角色"
      },
      rules: [],
      dataForm: {},
      rules: {
        name: { required: true, message: "请输入角色名称", trigger: "blur" },
        key: { required: true, message: "请输入角色权限标识", trigger: "blur" },
        sort: { required: true, message: "请输入显示顺序", trigger: "blur" }
      },
      roles: []
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.roleList();
    this.getPermissionData();
  },
  mounted() {},
  methods: {
    // 树搜索过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    // 获取角色列表
    roleList() {
      getRoleList(this.listQuery).then(response => {
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

    handleDelete(row, index) {
      this.$confirm("是否删除该角色", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole(row.id).then(response => {
            if (response.code === 0) {
              this.roleList();
              this.$notify({
                title: "成功",
                message: "删除角色成功",
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
      this.roleList();
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          delete this.dataForm.checkPassword;
          createRole(this.dataForm).then(response => {
            if (response.code === 0) {
              this.roleList();
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
          updateRole(this.dataForm.id, tempData).then(response => {
            if (response.code === 0) {
              this.roleList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新角色成功",
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
    },
    // 获取权限树
    getPermissionData() {
      getPermissionTree().then(response => {
        this.treeData = response.data;
        console.log(this.treeData);
      });
    },
    // 修改用户相关权限
    handlePermission(row) {
      console.log(row);
      this.dialogPermVisible = true;
      this.currentRole = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]);
        row.permissions.map((i, n) => {
          // 根据i获取tree中的节点
          const node = this.$refs.tree.getNode(i);
          if (node && node.isLeaf) {
            // 设置某个节点的勾选状态
            this.$refs.tree.setChecked(node, true);
          }
        });
      });
    },

    updatePermission() {
      console.log(this.$refs.tree.getHalfCheckedKeys());
      console.log(this.$refs.tree.getCheckedKeys());
      var checkedKeys = this.$refs.tree
        .getHalfCheckedKeys()
        .concat(this.$refs.tree.getCheckedKeys());
      console.log(checkedKeys);
      updateRolePermission(this.currentRole.id, {
        permission: checkedKeys
      }).then(response => {
        this.roleList();
        this.dialogPermVisible = false;
        if (response.code === 0) {
          this.$notify({
            title: "成功",
            message: "更新成功",
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
        console.log(response.data);
      });
    }
  }
};
</script>

<style scoped lang="scss">
// .filter-tree {
//   width: 100%;
//   height: 100%;
//   overflow: scroll;
// }
</style>
