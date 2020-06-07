import request from '@/utils/request'

const contentPath = '/api/v1/roles'

export function listRole() {
  return request({
    url: `${contentPath}`,
    method: 'get'
  })
}

export function pagingRoles(listQuery) {
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
