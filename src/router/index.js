import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/login'
import home from '@/views/home/home'
import user from '@/views/user/user'
Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    name: 'Login',
    component: login,
    hidden: false
  },
  {
    path: '/home',
    name: 'Home',
    component: home,
    hidden: false
  },
  {
    path: '/users',
    name: 'Users',
    component: user,
    hidden: false
  }
]

export default new Router({
  routes: constantRoutes
})
