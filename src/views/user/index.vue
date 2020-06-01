<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="登录名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="fetchData"
      />
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
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          {{ scope.row.mail }}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex | sexFilter }}
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
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusContentFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="editUser(row)">
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'添加用户'" @closed="dialogClosed">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="登录名">
          <el-input v-model="user.username" placeholder="登录名" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="user.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="user.telephone" placeholder="手机" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.mail" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="user.sex" label="MEN">男</el-radio>
          <el-radio v-model="user.sex" label="WOMEN">女</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="user.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ENABLED"
            inactive-value="DISABLED"
          />
        </el-form-item>
        <el-form-item label="角色信息">
          <el-select
            v-model="user.roleIdList"
            multiple
            filterable
            collapse-tags
            placeholder="请选择..."
            :loading="rolesLoading"
            @visible-change="roleListChange($event)"
          >
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.description"
              :value="role.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所在地">
          <el-input
            v-model="user.address"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>

      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveOrUpdateUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, updateStatus, deleteUser, saveUser, updateUser, getInfoById } from '@/api/user'
import { listRole } from '@/api/role'
import Pagination from '@/components/Pagination'

const defaultUser = {
  'address': '',
  'mail': '',
  'nickname': '',
  'password': '',
  'roleIdList': [],
  'sex': 'MEN',
  'status': 'ENABLED',
  'telephone': '',
  'username': ''
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
    },
    roleFilter(roles) {
      return roles === null ? '' : roles.toString()
    },
    sexFilter(sex) {
      const sexMap = {
        MEN: '男',
        WOMEN: '女'
      }
      return sexMap[sex]
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
      user: defaultUser,
      roleList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      listLoading: true,
      rolesLoading: false
    }
  },
  created() {
    this.fetchData()
    this.loadRoleInfos()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      console.log(new Date().getTime())
      const response = await getList(this.listQuery)
      console.log(new Date().getTime())
      console.log(response)
      this.list = response.list
      this.total = response.total
      this.listLoading = false
    },
    dialogClosed() {
      this.user = defaultUser
    },
    async loadRoleInfos() {
      this.rolesLoading = true
      await listRole().then(response => {
        console.log(response)
        this.rolesLoading = false
        this.roleList = response.data
      })
    },
    roleListChange(open) {
      console.log(open)
      open && (this.roleIdList === undefined || this.roleIdList.length === 0) ? this.loadRoleInfos() : this.roleList = []
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
        .catch(err => {
          console.error(err)
        })
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
    async editUser(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      const response = await getInfoById(row.id)
      this.user = response.data
      this.user.roleIdList = this.user.roleIds
    },
    async saveOrUpdateUser() {
      const isEdit = this.dialogType === 'edit'
      console.log(JSON.stringify(this.user))
      if (isEdit) {
        await updateUser(this.user.id, this.user)
      } else {
        await saveUser(this.user)
      }
      this.$message({
        type: 'success',
        message: isEdit ? '编辑' : '创建' + '用户成功！'
      })
      this.dialogVisible = false

      this.fetchData()
      this.user = defaultUser
    }
  }
}
</script>
