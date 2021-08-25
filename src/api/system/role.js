import request from "@/utils/request";

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: "/api/v1/system/role/",
    method: "get",
    params
  });
}

export function createRole(data) {
  return request({
    url: "/api/v1/system/role/",
    method: "post",
    data
  });
}

export function updateRole(id, data) {
  return request({
    url: `/api/v1/system/role/${id}/`,
    method: "put",
    data
  });
}

export function deleteRole(id) {
  return request({
    url: `/api/v1/system/role/${id}/`,
    method: "delete"
  });
}

//更新角色权限
export function updateRolePermission(id, data) {
  return request({
    url: `/api/v1/system/role/${id}/role_permission/`,
    method: "put",
    data
  });
}
