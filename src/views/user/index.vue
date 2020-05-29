<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="登录名" style="width: 200px;" class="filter-item" @keyup.enter.native="fetchData" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createUser">
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
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="editUser()">
            编辑
          </el-button>
          <el-button v-if="row.status=== 'ENABLED'" size="mini" type="warning" @click="disabledUser(row)">
            禁用
          </el-button>
          <el-button v-if="row.status=== 'DISABLED'" size="mini" type="success" @click="enabledUser(row)">
            启用
          </el-button>
          <el-button size="mini" type="danger" @click="deleteUser(row,$index)">
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
      @pagination="fetchData"
    />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'添加用户'">
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveOrUpdateUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, updateStatus, deleteUser } from '@/api/user'
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
        size: 10
      },
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
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
      getList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    deleteUser(row, $index) {
      this.$confirm('确定要删除该用户吗?', '注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.id)
          this.$message({
            type: 'success',
            message: '用户删除成功！'
          })
          this.fetchData()
        })
        .catch(err => { console.error(err) })
    },
    enabledUser(row) {
      updateStatus(row.id, 'ENABLED')
      row.status = 'ENABLED'
    },
    disabledUser(row) {
      updateStatus(row.id, 'DISABLED')
      row.status = 'DISABLED'
    },
    createUser() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    editUser() {
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    saveOrUpdateUser() {}
  }
}
</script>
