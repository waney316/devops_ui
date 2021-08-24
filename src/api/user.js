import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v1/jwt-token',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/system/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
