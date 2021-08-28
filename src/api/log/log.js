import request from "@/utils/request";

// 获取操作日志
export function getAuditLog(params) {
  return request({
    url: "/api/v1/audit/audit_log",
    method: "get",
    params
  });
}
