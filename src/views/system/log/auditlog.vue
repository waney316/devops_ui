<template>
  <div class="app-containter">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作日志</span>
      </div>

      <div class="text item">
        <div class="filter-container">
          <span class="span_style">请求方式</span>
          <el-select
            v-model="listQuery.method"
            clearable
            placeholder="请选择请求方式"
            size="mini"
          >
            <el-option
              v-for="(item, index) in requestOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
          <span class="span_style">请求用户</span>
          <el-input
            v-model="listQuery.username"
            clearable
            placeholder="请输入请求用户"
            size="mini"
            style="width: 150px"
          />
          <span class="span_style">请求路径</span>

          <el-input
            v-model="listQuery.search"
            clearable
            placeholder="请输入请求路径"
            size="mini"
            style="width: 200px"
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
        <el-table-column label="请求IP" prop="remote_ip" />
        <el-table-column label="用户" prop="username" />
        <el-table-column label="请求方式" prop="method">
          <template slot-scope="{ row }">
            <el-tag> {{ row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求路径" prop="url" min-width="160" />
        <el-table-column
          label="请求参数"
          prop="query_string"
          show-overflow-tooltip
        />
        <el-table-column label="响应状态码">
          <template v-if slot-scope="{ row }">
            <el-tag v-if="(row.status_code = 200)" type="success">{{
              row.status_code
            }}</el-tag>
            <el-tag v-else type="danger">{{ row.status_code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求时间">
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
        @pagination="auditLogList"
      />
    </el-card>
  </div>
</template>

<script>
import { getAuditLog } from "@/api/log/log";

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
      requestOptions: ["PUT", "POST", "GET", "DELETE"]
    };
  },
  created() {
    this.auditLogList();
  },
  mounted() {},
  methods: {
    // 获取操作日志
    auditLogList() {
      this.listLoading = true;
      getAuditLog(this.listQuery).then(response => {
        console.log(response.data);
        this.list = response.data.results;
        this.total = response.data.count;
        this.listLoading = false;
      });
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.auditLogList();
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
