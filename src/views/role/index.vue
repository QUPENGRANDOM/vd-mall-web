<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roleName"
        placeholder="角色名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="loadData"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="loadData">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createRole">
        新建
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="角色名" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusContentFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="editRole(row)">
            编辑
          </el-button>
          <el-button v-if="row.status=== 'ENABLED'" size="mini" type="warning" @click="disabledRole(row)">
            禁用
          </el-button>
          <el-button v-if="row.status=== 'DISABLED'" size="mini" type="success" @click="enabledRole(row)">
            启用
          </el-button>
          <el-button size="mini" type="danger" @click="deleteRole(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="loadData"
    />
  </div>
</template>
<script>
import { pagingRoles, updateStatus } from '@/api/role'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        ENABLED: 'success',
        DISABLED: 'danger'
      }
      return statusMap[status]
    },
    statusContentFilter(status) {
      const statusMap = {
        ENABLED: '启用',
        DISABLED: '禁用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      listLoading: true
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      pagingRoles(this.listQuery).then(response => {
        this.list = response.list
        console.log(this.list)
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    createRole() {
      this.$message({
        type: 'warning',
        message: '该功能暂未实现'
      })
    },
    editRole(row) {
      this.$message({
        type: 'warning',
        message: '该功能暂未实现'
      })
    },
    enabledRole(row) {
      updateStatus(row.id, 'ENABLED')
      row.status = 'ENABLED'
    },
    disabledRole(row) {
      updateStatus(row.id, 'DISABLED')
      row.status = 'DISABLED'
    },
    deleteRole(row) {
      this.$message({
        type: 'warning',
        message: '该功能暂未实现'
      })
    }
  }
}
</script>
