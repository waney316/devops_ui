import { getMenuTree, getUserpermissions } from "@/api/system/permission";

const getDefaultState = () => {
  return {
    //存放用户菜单
    menus: "",
    //存放用户权限
    permisaction: []
  };
};

const state = getDefaultState();
const mutations = {
  //菜单
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  },
  SET_PERMISSIONS: (state, permisaction) => {
    state.permisaction = permisaction;
  }
};

const actions = {
  // get router
  getRouter({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenuTree().then(response => {
        const menus = response.data;
        if (!menus) {
          reject("未查询到菜单数据，请确认。");
        }

        menus.push({ path: "*", redirect: "/404", hidden: true }); // 这个必须在路由表的最后面

        commit("SET_MENUS", menus);

        resolve(menus);
      });
    });
  },

  // 查询拥有权限的页面标签标识
  getPermissions({ commit, state }) {
    // 新增
    return new Promise((resolve, reject) => {
      getUserpermissions().then(res => {
        commit("SET_PERMISSIONS", res.data);
        resolve(res.data);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
