import request from '@/utils/request'

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/api/v1/system/role/',
    method: 'get',
    params
  })
}
