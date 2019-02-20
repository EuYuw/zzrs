import Vue from 'vue'
import Router from 'vue-router'
/** 基础 **/
const layout = () => import('../view/layout/layout')
const home = () => import('../view/layout/home')
const loginForME = () => import('../view/login/loginForME')
const login = () => import('../view/login/login')
const page404 = () => import('../view/error/page404')
/** 基础数据定义 **/
const site = () => import('../view/baseData/site/index')
const device = () => import('../view/baseData/device/index')
/** 设备状态监测 **/
const statusMonitor = () => import('../view/deviceMonitor/statusMonitor/index')
/** 设备故障报警 **/
const faultAlarm = () => import('../view/deviceAlarm/faultAlarm/index')
const faultDefine = () => import('../view/deviceAlarm/faultDefine/index')
/** 设备远程控制 **/
const paramEdit = () => import('../view/deviceControll/paramEdit/index')
const operDefine = () => import('../view/deviceControll/operDefine/index')
const teleControll = () => import('../view/deviceControll/teleControll/index')
/** 数据统计分析 **/
const waterUsed = () => import('../view/dataAnalysis/waterUsed/index')
const elecUsed = () => import('../view/dataAnalysis/elecUsed/index')
const waterPrice = () => import('../view/dataAnalysis/waterPrice/index')
/** 系统管理 **/
const dept = () => import('../view/system/dept/index')
const resource = () => import('../view/system/resource/index')
const role = () => import('../view/system/role/index')
const user = () => import('../view/system/user/index')
/**  高德地图 **/
const AMMark = () => import('../view/AMap/index')
/** 计价扣费 **/
const valuation = () => import('../view/valuation/index')
/** 缴费历史 **/
const payHistory = () => import('../view/payHistory/index')
/**  历史用水 **/
const waterHistory = () => import('../view/waterHistory/index')
/**  充值缴费**/
const recharge = () => import('../view/recharge/index')

Vue.use(Router);
/** base router* */
export const constRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/zzrsLoginForME',
    name: 'loginFME',
    component: loginForME
  },
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/home',
    component: layout,
    children: [
      {
        path: '',
        component: home,
        meta: {
          auth: true
        }
      }
    ]
  }
];
/** manager async router **/
export const managerRouter = [
  {
    path: '/baseData',
    name: '基础数据定义',
    code: 'baseData',
    component: layout,
    icon: 'iconfont icon-gongnengdingyi',
    show: true,
    children: [
      {
        path: 'site',
        name: '站点',
        code: 'baseData_site',
        component: site,
        icon: 'iconfont icon-jiedianguanli',
        meta: {
          auth: true
        }
      },
      {
        path: 'device',
        name: '设备',
        code: 'baseData_device',
        component: device,
        icon: 'iconfont icon-shebeizhuangtai',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/deviceMonitor',
    name: '设备状态监测',
    code: 'deviceMonitor',
    component: layout,
    icon: 'iconfont icon-shexiangtou',
    show: true,
    children: [
      {
        path: 'statusMonitor',
        name: '状态监测',
        code: 'deviceMonitor_sm',
        component: statusMonitor,
        icon: 'iconfont icon-shexiangtou',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/deviceAlarm',
    name: '设备故障报警',
    code: 'deviceAlarm',
    component: layout,
    icon: 'iconfont icon-gaojing',
    show: true,
    children: [
      {
        path: 'faultDefine',
        name: '故障定义',
        code: 'deviceAlarm_fd',
        component: faultDefine,
        icon: 'iconfont icon-gongnengdingyi',
        meta: {
          auth: true
        }
      },
      {
        path: 'faultAlarm',
        name: '故障报警',
        code: 'deviceAlarm_fa',
        component: faultAlarm,
        icon: 'iconfont icon-gaojing',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/deviceControll',
    name: '设备远程控制',
    code: 'deviceControll',
    component: layout,
    icon: 'iconfont icon-guanlianshebei',
    show: true,
    children: [
      {
        path: 'paramEdit',
        name: '参数修改',
        code: 'deviceControll_pe',
        component: paramEdit,
        icon: 'iconfont icon-brush',
        meta: {
          auth: true
        }
      },
      {
        path: 'operDefine',
        name: '操作定义',
        code: 'deviceControll_od',
        component: operDefine,
        icon: 'iconfont icon-zidingyi',
        meta: {
          auth: true
        }
      },
      {
        path: 'teleControll',
        name: '远程控制',
        code: 'deviceControll_tc',
        component: teleControll,
        icon: 'iconfont icon-guanlianshebei',
        meta: {
          auth: true
        }
      },
    ]
  },
  {
    path: '/dataAnalysis',
    name: '数据统计分析',
    code: 'dataAnalysis',
    component: layout,
    icon: 'iconfont icon-shujukanban',
    show: true,
    children: [
      {
        path: 'waterUsed',
        name: '用水状况查询',
        code: 'dataAnalysis_wu',
        component: waterUsed,
        icon: 'iconfont icon-shuibiao',
        meta: {
          auth: true
        }
      },
      {
        path: 'elecUsed',
        name: '设备用电查询',
        code: 'dataAnalysis_eu',
        component: elecUsed,
        icon: 'iconfont icon-dianbiao',
        meta: {
          auth: true
        }
      },
      {
        path: 'waterPrice',
        name: '用户用水计价',
        code: 'dataAnalysis_wp',
        component: waterPrice,
        icon: 'iconfont icon-YUAN',
        meta: {
          auth: true
        }
      },
    ]
  },
  {
    path: '/system',
    name: '系统管理',
    code: 'system',
    component: layout,
    icon: 'iconfont icon-icon_yingyongguanli',
    show: true,
    children: [
      {
        path: 'dept',
        name: '部门管理',
        code: 'system_dept',
        component: dept,
        icon: 'iconfont icon-group',
        meta: {
          auth: true
        }
      },
      {
        path: 'user',
        name: '用户管理',
        code: 'system_user',
        component: user,
        icon: 'iconfont icon-people',
        meta: {
          auth: true
        }
      },
      {
        path: 'role',
        name: '角色管理',
        code: 'system_role',
        component: role,
        icon: 'iconfont icon-addressbook',
        meta: {
          auth: true
        }
      },
      {
        path: 'resource',
        name: '资源管理',
        code: 'system_resource',
        component: resource,
        icon: 'iconfont icon-manage',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/amap',
    name: '高德地图',
    code: 'amap',
    component: layout,
    icon: 'iconfont icon-icon_yingyongguanli',
    show: true,
    children: [
      {
        path: 'demo',
        name: '打点DEMO',
        code: 'amap_demo',
        component: AMMark,
        icon: 'iconfont icon-group',
        meta: {
          auth: true
        }
      }
    ]
  }
];
/** portal async router **/
export const portalRouter = [
  {
    path: '/valuation',
    code: 'valuation',
    component: layout,
    show: true,
    children: [
      {
        path: '',
        name: '计价扣费',
        component: valuation,
        icon: 'iconfont icon-zidingyi',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/payHistory',
    code: 'payHistory',
    component: layout,
    show: true,
    children: [
      {
        path: '',
        name: '缴费历史',
        component: payHistory,
        icon: 'iconfont icon-zhexiantu',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/waterHistory',
    code: 'waterHistory',
    component: layout,
    show: true,
    children: [
      {
        path: '',
        name: '历史用水',
        component: waterHistory,
        icon: 'iconfont icon-shuibiao',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/recharge',
    code: 'recharge',
    component: layout,
    show: true,
    children: [
      {
        path: '',
        name: '充值缴费',
        component: recharge,
        icon: 'iconfont icon-YUAN',
        meta: {
          auth: true
        }
      }
    ]
  }
];
export default new Router({
  routes: constRouterMap,
  scrollBehavior: () => ({ y: 0 })
});



