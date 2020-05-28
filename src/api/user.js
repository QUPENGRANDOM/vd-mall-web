import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/v1/users/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/api/v1/users/${1}`,
    method: 'get'
  })
}

export function getList(page, size) {
  return request({
    url: `/api/v1/users/paging`,
    method: 'get',
    params: { page: page, size: size }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
