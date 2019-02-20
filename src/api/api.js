/**
 *   axios request API
 */

import {GET, POST, PUT, PATCH, DEL} from './http';

/**  user api **/
export const userAPI = {
  login: param => {//登录
    return POST('/api/user/login', param);
  },
  loginUser: () => {//获取登录用户
    return GET('/api/user/loginUser');
  },
  getListFun: () =>{//获取权限集
    return GET('/api/user/listFunctions');
  },
  logout: () => {//注销退出
    return GET('/api/user/logout');
  },
  register: param => {//注册
    return POST('/api/user/register', param);
  },
  resetPassword: param => {//重置密码
    return PUT('/api/user/resetPassword', param);
  },
  getCode: param => {//获取验证码
    return GET('/api/user/sendSms', param);
  },
  add: param => {//新增
    return POST('/api/user/add', param);
  },
  search: param => {//查询user
    return GET('/api/user/search', param);
  },
  del: param => {//删除user
    return DEL('/api/user/delete/' + param.id);
  },
  update: param => {//编辑
    return PUT('/api/user/' + param.id, param);
  },
  disable: param => {//挂起
    return GET('/api/user/disable', param);
  },
  enable: param => {//启用
    return GET('/api/user/enable', param);
  }
};
/**  user api **/

/** role api **/
export const roleAPI = {
  add: param => {
    return POST('/api/role', param);
  },
  update: param => {
    return PUT('/api/role', param);
  },
  search: param => {
    return GET('/api/role/search', param);
  },
  del: param => {
    return DEL('/api/role/' + param.id);
  },
  checkRoleCode: param => {
    return GET('/api/role/findByCode', param);
  }
}
/** role api **/

/**  site api **/
export const siteAPI = {
  search: param => {//站点查询
    return GET('/api/site/search', param);
  },
  add: param => {//新增站点
    return POST('/api/site/add', param);
  },
  del: param => {//删除站点
    return DEL('/api/site/delete/' + param.siteId);
  },
  muchDel: param => {//站点批量删除
    return DEL('/api/site/deleteSites', param);
  },
  update: param => {//站点编辑
    return PUT('/api/site/' + param.siteId, param);
  }
}
/**  site api **/

/**  plc api**/
export const plcAPI = {
  groupAdd: param => {//plc组新增
    return POST('/api/plcUnitGroup/add', param);
  },
  groupSearch: param => {//plc组查询
    return GET('/api/plcUnitGroup/search', param);
  },
  groupDel: param => {//plc组删除
    return DEL('/api/plcUnitGroup/delete/' + param.id);
  },
  groupUpdate: param => {//plc组编辑
    return PUT('/api/plcUnitGroup/update', param);
  },
  unitAdd: param => {//plc单元新增
    return POST('/api/plcUnit/add', param);
  },
  unitSearch: param => {//plc单元查询
    return GET('/api/plcUnit/search', param);
  },
  unitDel: param => {//plc单元删除
    return DEL('/api/plcUnit/delete/' + param.id);
  },
  unitUpdate: param => {//plc单元编辑
    return PUT('/api/plcUnit/update', param);
  }
}
/**  plc api**/

/**  device api **/
export const deviceAPI = {
  search: param => {//设备查询
    return GET('/api/device/search', param);
  },
  searchNoLink: () => {//查询未关联的设备
    return GET('/api/device/findNotLink');
  },
  add: param => {//新增设备
    return POST('/api/device/add', param);
  },
  del: param => {//设备删除
    return DEL('/api/device/delete/' + param.deviceId);
  },
  muchDel: param => {//设备批量删除
    return DEL('/api/device/deleteDevices', param);
  },
  update: param => {//设备编辑
    return PUT('/api/device/update', param);
  },
  /*updateDatas: param => {
    return PUT('/api/device/updateDatas', param);
  }*/
  linkToSite: param => {//设备关联站点
    return PUT('/api/device/addDeviceToSite', param);
  },
  searchSiteLinkDevice: param => {//查询站点关联的设备
    return GET('/api/device/findBySiteId/' + param.siteId);
  }
}
/**  device api **/

/** waterMeterCount **/
export const waterMeterCountAPI = {
  searchCostByUser: param => {//统计个人记价扣费情况
    return GET('/api/watermetercount/searchCostByUser', param);
  },
  searchCountByUser: param => {//统计当前登录用户用水情况
    return GET('/api/watermetercount/searchCountByUser', param);
  },
  searchCount: param => {//统计用水情况
    return GET('/api/watermetercount/searchCount', param);
  },
  searchCost: param => {//统计用水记价情况
    return GET('/api/watermetercount/searchCost', param);
  }
}
/** waterMeterCount **/

/** pay API **/
export const payAPI = {
  logSearch: param => {//缴费查询
    return GET('/api/payLog/search', param);
  },
  logDetail: param => {//缴费账单详情
    return GET('/api/payLog/' + param.id);
  },
  wxPay: param => {//微信支付
    return GET('/api/wechatPay/getPayQrcode', param);
  }
}
/** pay API **/
