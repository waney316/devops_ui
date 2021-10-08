<template>
  <div class="app-containter">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>登录日志</span>
      </div>

      <div class="text item">
        <div class="filter-container">
          <span class="span_style">请求用户</span>
          <el-input
            v-model="listQuery.username"
            placeholder="请输入登录请求用户"
            size="mini"
            clearable
            style="width: 150px"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            style="margin-left: 10px"
            @click="handleFilter()"
          >
            搜索</el-button
          >
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
        style="width: 100%; margin-top: 20px;"
      >
        <el-table-column label="登录IP" prop="remote_ip" />
        <el-table-column label="登录用户" prop="username" />
        <el-table-column label="请求主体" prop="body" min-width="160">
          <template slot-scope="{ row }">
            {{ row.body }}
          </template>
        </el-table-column>

        <el-table-column label="是否登录成功">
          <template slot-scope="{ row }">
            <el-tag v-if="row.status_code == 200" type="success">
              {{ row.status }}/{{ row.status_code }}
            </el-tag>
            <el-tag v-else type="danger">
              {{ row.status }}/{{ row.status_code }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="登录时间">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        style="float: right"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="loginLogList"
      />
    </el-card>
  </div>
</template>

<script>
import { getLoginLog } from "@/api/log/log";

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
      listLoading: false
    };
  },
  created() {
    this.loginLogList();
  },
  mounted() {},
  methods: {
    // 获取操作日志
    loginLogList() {
      this.listLoading = true;
      getLoginLog(this.listQuery).then(response => {
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false;
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.loginLogList();
    }
  }
};
</script>

<style scoped>
.span_style {
  font-weight: 700;
  font-size: 13px;
  color: #606266;
  padding: 0 12px 0 0;
  line-height: 36px;
  width: 68px;
  margin-left: 10px;
}
</style>
