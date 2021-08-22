import store from "@/store";

export default {
  inserted(el, binding, vnode) {
    const { value } = binding; // 获取指令的绑定值
    const all_permission = "*:*:*"; // 表示所有权限
    const permissions = store.getters && store.getters.permisaction; // 从 Vuex 中获取数据

    if (value && value instanceof Array && value.length > 0) {
      // 验证数据是否有效，如果有效则继续
      const permissionFlag = value;

      const hasPermissions = permissions.some(permission => {
        // 检测数组中的元素是否满足指定条件
        // 检测是否为管理员权限，或者此标签元素是否有权限
        return (
          all_permission === permission || permissionFlag.includes(permission)
        );
      });

      // 若没有权限，则隐藏自定义指定绑定的标签元素
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  }
};
