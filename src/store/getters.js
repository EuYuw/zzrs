const getters = {
  userCurrent: state => state.user.current,//获取当前登录
  accessArr: state => state.user.accessArr,//权限
  userType: state => state.user.userType,//用户类型
  willAddRouter: state => state.permission.willAddRouter,//根据权限生成的路由
  permissionRouters: state => state.permission.routers,//所有路由
};
export default getters
