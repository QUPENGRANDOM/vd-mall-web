<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="登录名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="所属角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleNames | roleFilter }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="账号状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { getList } from '@/api/user'

import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        ENABLED: 'success',
        DISABLED: 'danger'
      }
      return statusMap[status]
    },
    roleFilter(roles) {
      return roles === null ? '' : roles.toString()
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery.page, this.listQuery.limit).then(response => {
        console.log(response)
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    }
  }
}
</script>
