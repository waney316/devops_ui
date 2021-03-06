const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  //权限和菜单
  menus: state => state.system.menus,
  permisaction: state => state.system.permisaction,

  //tagsView缓存
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
};
export default getters;
