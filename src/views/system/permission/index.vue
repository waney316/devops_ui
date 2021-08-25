<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>权限管理</span>
      </div>
      <div>
        <div class="filter-container">
          <el-button
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
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="icon" label="图标">
            <template slot-scope="{ row }">
              <svg-icon :icon-class="row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="顺序" />
          <el-table-column prop="permission" label="权限标识" />
          <el-table-column prop="path" label="路由地址" />
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
                type="text"
                size="mini"
                icon="el-icon-plus"
                @click="handleCreateNode(row)"
              >
                新建
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
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
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
  created() {},
  mounted() {},
  methods: {
    handleCreateNode() {},
    handleUpdate() {},
    handleDelete() {}
  }
};
</script>

<style scoped lang="less"></style>
