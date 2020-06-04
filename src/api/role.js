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
