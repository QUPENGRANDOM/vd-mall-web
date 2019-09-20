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
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="登录名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" >
        <template slot-scope="scope">
          {{ scope.row.sex |statusFilter}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getUserList} from '@/api/user'

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '男',
        1: '女'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      list: null,
      listLoading: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      getUserList().then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    }
  }
}
</script>
