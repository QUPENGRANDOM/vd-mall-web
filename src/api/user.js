import httpRequest from '@/utils/httpRequest'

export function getUserList () {
  return httpRequest.get(`/admin/api/v1/users`)
}

export function getLoginUserInfo () {
  return httpRequest.get(`/admin/api/v1/users/current`)
}
