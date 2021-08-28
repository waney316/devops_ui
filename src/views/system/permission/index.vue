<template>
  <div class="app-containter">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>权限管理</span>
      </div>
      <div>
        <div class="filter-container">
          <el-button
            v-permisaction="['system:permission:create']"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style=" margin-right: 8px;"
            @click="handleCreate"
            >新 建</el-button
          >
          <el-input
            v-model="listQuery.title"
            placeholder="请输入搜索内容"
            size="mini"
            style="width: 350px;"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleFilter"
            />
          </el-input>
        </div>

        <el-table
          v-loading="false"
          :data="list"
          style="width: 100%; margin-top: 10px;"
          row-key="id"
          border
          fit
          highlight-current-row
          size="mini"
          :default-expand-all="false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="icon" label="图标" width="60">
            <template slot-scope="{ row }">
              <svg-icon :icon-class="row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="顺序" width="60" />
          </
          <el-table-column prop="permission" label="权限标识" />
          <el-table-column prop="component" label="组件名称" min-width="160" />
          <el-table-column prop="path" label="路由地址" min-width="160" />
          <el-table-column label="是否隐藏">
            <template slot-scope="{ row }">
              <el-tag v-if="row.hidden" size="mini" type="danger">隐藏</el-tag>
              <el-tag v-else size="mini" type="success">可见</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                v-permisaction="['system:permission:create']"
                type="text"
                size="mini"
                icon="el-icon-plus"
                @click="handleCreateNode(row)"
              >
                新建
              </el-button>
              <el-button
                v-permisaction="['system:permission:edit']"
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="handleUpdate(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permisaction="['system:permission:delete']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(row, $index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 权限更新 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单：" prop="parent" size="mini">
              <treeselect
                v-model="dataForm.parent"
                :options="treeSelectOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
                class="get-tree-menu"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="dataForm.title" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序：" prop="sort">
              <!-- <el-input v-model="dataForm.sort" size="mini"/> -->
               <el-input-number v-model="dataForm.sort"  :min="0"  label="描述文字" size="small"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型：" prop="type">
              <el-radio-group v-model="dataForm.type" size="small">
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">标签</el-radio>
                <el-radio :label="3">接口</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标：" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="dataForm.icon"
                  placeholder="点击选择图标"
                  readonly
                  size="small"
                >
                  <svg-icon
                    v-if="dataForm.icon"
                    slot="prefix"
                    :icon-class="dataForm.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="dataForm.type === 1"
              label="路由名称："
              prop="name"
            >
              <el-input v-model="dataForm.name" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="dataForm.type === 1"
              label="路由地址："
              prop="path"
            >
              <el-input v-model="dataForm.path" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="dataForm.type === 1"
              label="组件地址："
              prop="component"
            >
              <el-input v-model="dataForm.component" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="dataForm.type === 1"
              label="路由别名："
              prop="alias"
            >
              <el-input v-model="dataForm.alias" size="small" />
            </el-form-item>
          </el-col>
          <el-col v-if="dataForm.type === 2" :span="12">
            <el-form-item label="权限标识：" prop="permission">
              <el-input v-model="dataForm.permission" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否外链：" prop="external_link">
              <el-radio-group v-model="dataForm.external_link" size="small">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否隐藏：" prop="hidden">
              <el-radio-group v-model="dataForm.hidden" size="small">
                <el-radio :label="true">隐藏</el-radio>
                <el-radio :label="false">显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="dataForm.external_link === true"
              label="外链地址"
              prop="redirect"
            >
              <el-input v-model="dataForm.redirect" size="small" />
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
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  updatePermissions,
  deletePermissions,
  createPermissions,
  getPermissionTree
} from "@/api/system/permission";

import waves from "@/directive/waves";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Permission",
  directives: { waves },
  components: {
    Treeselect,
    IconSelect
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      treeSelectOptions: null,
      total: 0,
      listLoading: true,
      listQuery: {},
      dataForm: {
        id: undefined,
        sort: 0,
        type: 1,
        external_link: false,
        hidden: false
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新建"
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getPermissionList();
  },
  mounted() {},
  methods: {
    getPermissionList() {
      this.listLoading = true;
      getPermissionTree(this.listQuery).then(response => {
        console.log(response.data);
        if (response.code == 0) {
          this.list = response.data;
          this.treeSelectOptions = JSON.parse(JSON.stringify(response.data));
          this.treeSelectOptions.unshift({
            id: 0,
            title: "主类目",
            children: []
          });
          this.listLoading = false;
        } else {
          this.$notify({
            title: "失败",
            message: response.message,
            type: "error",
            duration: 2000
          });
        }
      });
    },

    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      };
    },
    selected(name) {
      this.dataForm.icon = name;
      console.log(this.dataForm.icon);
    },
    handleFilter() {
      this.getPermissionList();
    },
    resetDataForm() {
      this.dataForm = {
        id: undefined,
        sort: 0,
        type: 1,
        external_link: false,
        hidden: false
      };
    },
    handleCreate() {
      this.resetDataForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleCreateNode(row) {
      this.resetDataForm();
      this.dataForm.parent = row.id;
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createPermissions(this.dataForm).then(response => {
            this.dialogFormVisible = false;
            if (response.code == 0) {
              this.$notify({
                title: "成功",
                message: "创建成功,请刷新页面",
                type: "success",
                duration: 2000
              });
              this.getPermissionList();
            } else {
              this.$notify({
                title: "失败",
                message: response.message,
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.dataForm);
          console.log(tempData);
          updatePermissions(this.dataForm.id, tempData).then(res => {
            this.dialogFormVisible = false;
            if (res.code === 0) {
              this.getPermissionList();
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.message,
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("删除权限?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          deletePermissions(row.id).then(res => {
            if (res.code === 0) {
              this.getPermissionList();
              this.$notify({
                title: "成功",
                message: "删除成功, 请刷新页面",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.message,
                type: "error",
                duration: 2000
              });
            }
          });
          //
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .get-tree-menu .vue-treeselect__input-container {
  height: 30px;
  colorp: #606266;
}
::v-deep .get-tree-menu .vue-treeselect__control {
  height: 30px;
}
::v-deep .get-tree-menu .vue-treeselect__single-value {
  colorp: #606266;
}
</style>
