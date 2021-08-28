import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

import Layout from "@/layout";
import CommonLayout from "@/views/common/layout.vue";
const _import = require("./router/_import_" + process.env.NODE_ENV); // 获取组件的方法

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // get user info
          await store.dispatch("user/getInfo");
          await store.dispatch("system/getRouter"); // 获取路由表
          await store.dispatch("system/getPermissions"); //获取用户对应的权限
          if (store.getters.menus.length < 1) {
            global.RouterList = [];
            next();
          }

          const menus = filterAsyncRouter(store.getters.menus); // 1.过滤路由
          router.addRoutes(menus); // 2.动态添加路由
          global.RouterList = menus; // 3.将路由数据传递给全局变量，做侧边栏菜单渲染工作
          next({
            ...to,
            replace: true
          });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error.message || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      try {
        if (route.component === "Layout") {
          route.component = Layout;
        } else if (route.component === "CommonLayout") {
          route.component = CommonLayout;
        } else {
          route.component = _import(route.component); // 导入组件
        }
      } catch (e) {
        route.component = CommonLayout;
        Message.error(e.message);
      }
    }
    // route.name = route.name;
    route.meta = {
      title: route.title,
      icon: route.icon
    };

    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });

  return accessedRouters;
}
