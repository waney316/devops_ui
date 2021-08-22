<template>
  <div class="app-containter">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
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
            >新 建</el-button
          >
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
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="是否管理员" prop="is_superuser">
          <template slot-scope="{ row }">
            <el-tag v-if="row.is_superuser" size="mini" type="success"
              >是</el-tag
            >
            <el-tag v-else size="mini" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" prop="is_superuser">
          <template slot-scope="{ row }">
            <el-switch size="mini" v-model="row.is_active" disabled
              >否</el-switch
            >
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
          width="230"
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
          </template>
        </el-table-column>
      </el-table>

      <pagination
        style="float: right"
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>

    <!-- 更新和新增弹窗 -->
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="dataForm.username"
                placeholder="请输入用户名"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="dataForm.email"
                placeholder="请输入邮箱"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roles">
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
            <el-form-item label="是否管理员" prop="is_superuser">
              <el-radio-group v-model="dataForm.is_superuser" size="mini">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
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
    </el-dialog> -->
  </div>
</template>

<script>
import {
  getUserList,
  createUser,
  deleteUser,
  updateUser
} from "@/api/system/user";

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
      dataForm: {},
      rules: []
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      this.listLoading = true;
      getUserList(this.listQuery).then(response => {
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false;
      });
    },
    handleCreate() {},
    handleSelect() {},
    handleDelete() {},
    handleUpdate() {},
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    }
  }
};
</script>

<style scoped lang="less"></style>
