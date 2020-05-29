import request from '@/utils/request'

const contentPath = '/api/v1/users'

export function login(data) {
  return request({
    url: `${contentPath}/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${contentPath}/${1}`,
    method: 'get'
  })
}

export function getList(listQuery) {
  return request({
    url: `${contentPath}/paging`,
    method: 'get',
    params: listQuery
  })
}

export function updateStatus(id, status) {
  const path = status.toLowerCase()
  return request({
    url: `${contentPath}/${id}/${path}`,
    method: 'put'
  })
}

export function logout() {
  return request({
    url: `${contentPath}/logout`,
    method: 'post'
  })
}

export function deleteUser(id) {
  return request({
    url: `${contentPath}/${id}`,
    method: 'delete'
  })
}
