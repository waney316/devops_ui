import permission from "./permission";
import permisaction from "./permisaction"; // 引入

const install = function(Vue) {
  Vue.directive("permission", permission);
  Vue.directive("permisaction", permisaction); // 注册指令
};

if (window.Vue) {
  window["permission"] = permission;
  window["permisaction"] = permisaction; // 将自定义指令挂在到window对象上
  Vue.use(install); // eslint-disable-line
}

permission.install = install;
export default permission;
