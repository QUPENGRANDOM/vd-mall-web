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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'添加角色'" @closed="dialogClosed">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名">
          <el-input v-model="role.roleName" placeholder="角色名" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="role.description" placeholder="描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="role.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ENABLED"
            inactive-value="DISABLED"
          />
        </el-form-item>
      </el-form>

      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveOrUpdateRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { pagingRoles, updateStatus, saveRole, deleteRole, updateRole, getInfoById } from '@/api/role'
import Pagination from '@/components/Pagination'

const defaultRole = {
  'description': '',
  'roleName': '',
  'status': 'ENABLED'
}
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
      role: defaultRole,
      dialogVisible: false,
      dialogType: 'new',
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
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    dialogClosed() {
      this.role = defaultRole
    },
    async editRole(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      const response = await getInfoById(row.id)
      this.role = response.data
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
      this.$confirm('确定要删除该角色吗?', '注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.$message({
            type: 'success',
            message: '角色删除成功！'
          })
          this.loadData()
        })
        .catch(err => {
          console.error(err)
        })
    },
    async saveOrUpdateRole() {
      const isEdit = this.dialogType === 'edit'
      console.log(JSON.stringify(this.role))
      if (isEdit) {
        await updateRole(this.role.id, this.role)
      } else {
        await saveRole(this.role)
      }
      this.$message({
        type: 'success',
        message: isEdit ? '编辑' : '创建' + '用户成功！'
      })
      this.dialogVisible = false

      this.loadData()
      this.user = defaultRole
    }
  }
}
</script>
