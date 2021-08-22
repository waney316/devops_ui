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
            >新 建</el-button
          >
          <el-input
            v-model="listQuery.username"
            placeholder="请输入搜索用户"
            size="mini"
            style="width: 250px;"
          >
            <el-button slot="append" icon="el-icon-search" />
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
    </el-card>
  </div>
</template>

<script>
import {
  getUserList,
  createUser,
  deleteUser,
  updateUser
} from "@/api/system/user";
export default {
  data() {
    return {
      list: [],
      tableKey: 0,
      listQuery: {},
      listLoading: false
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
    handleSelect() {},
    handleDelete() {},
    handleUpdate() {}
  }
};
</script>

<style scoped lang="less"></style>
