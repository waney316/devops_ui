import request from "@/utils/request";

//获取菜单列表
export function getMenuTree() {
  return request({
    url: "/api/v1/system/menu_tree",
    method: "get"
  });
}

//获取权限树
export function getPermissionTree(params) {
  return request({
    url: "/api/v1/system/permission_tree",
    method: "get",
    params
  });
}

//获取当前用户权限标识
export function getUserpermissions(params) {
  return request({
    url: "/api/v1/system/user_permission",
    method: "get",
    params
  });
}
