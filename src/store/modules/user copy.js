import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

import { getMenuTree, getUserpermissions } from "@/api/system/permission";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",

    //存放用户菜单
    menus: "",
    //存放用户权限
    permisaction: []
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },

  //菜单
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  },
  SET_PERMISSIONS: (state, permisaction) => {
    state.permisaction = permisaction;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          commit("SET_TOKEN", response.data);
          setToken(response.data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { username, avatar } = data;
          commit("SET_NAME", username);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },

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
