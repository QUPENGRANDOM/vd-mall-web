<template>
  <div>欢迎！{{username}}，{{sex | showSex}}</div>
</template>

<script>
import {getLoginUserInfo} from '@/api/user'
export default {
  name: 'home',
  filters: {
    showSex (value) {
      const status = {
        0: '帅哥',
        1: '美女'
      }
      return status[value]
    }
  },
  data () {
    return {
      username: '',
      sex: 1
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      getLoginUserInfo().then(response => {
        let user = response.data.data
        debugger
        this.username = user.nickname
        this.sex = user.sex
      })
    }
  }
}
</script>

<style scoped>

</style>
