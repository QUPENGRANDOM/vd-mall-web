import httpRequest from '@/utils/httpRequest'

export function login (data) {
  return httpRequest.post(`/admin/api/v1/users/login`, data)
}
