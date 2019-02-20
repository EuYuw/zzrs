// MAIN
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import store from './store/store'
import router from './router/router'
import ElementUI from 'element-ui'
import {Message, Loading} from 'element-ui'
import es6Promise from 'es6-promise';//ie promise兼容
import axios from 'axios'
import VueAMap from 'vue-amap'
/*import NProgress from 'nprogress'
import 'nprogress/nprogress.css'*/
import 'element-ui/lib/theme-chalk/index.css'
import './style/common.css'
import './style/iconfont.css'

Vue.config.productionTip = false;
/*Vue.config.devtools = false;*/

es6Promise.polyfill();
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading;
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.use(VueAMap);

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'loginFME') {
    next();
  } else {
    const userGet = store.getters.userCurrent;
    let sessionAuth = false;
    if (sessionStorage.getItem('routerAuth')) {//当前路由path等于sessionStorage routerAuth, 说明是需要auth的
      let auth = JSON.parse(sessionStorage.getItem('routerAuth')).pathArr;
      sessionAuth = auth.indexOf(to.path) === -1 ? false : true;
    }
    if (to.meta.auth || sessionAuth) {//如果存在meta auth
      if (userGet) {//是否存在current login user
        if (store.getters.accessArr.length === 0) {//是否获取过权限列表
          store.dispatch('user/getAccess').then(res => {
            store.dispatch('permission/createNewRouter', res).then(() => {
              router.addRoutes(store.getters.willAddRouter);
              next(to.path); // hack
            });
          }).catch(error => {
            console.log(error);
          });
        } else {
          next();
        }
      } else {
        store.dispatch('user/getLoginUser').then(() => {//不存在current login user，则尝试去获取
          next(to.path);
        }).catch(error => {
          console.log(error);
        });
      }
    } else {
      next();
    }
  }
});
router.afterEach((to) => {
  if (to.meta.hasOwnProperty('auth')) {//动态路由刷新后 meta字段信息丢失，用sessionStorage存储
    if (sessionStorage.getItem('routerAuth')) {
      let newPathJson = JSON.parse(sessionStorage.getItem('routerAuth'));
      if (newPathJson.pathArr.indexOf(to.path) === -1) {
        newPathJson.pathArr.push(to.path);
        sessionStorage.setItem('routerAuth', JSON.stringify(newPathJson));
      }
    } else {
      let pathArr = [to.path];
      let pathArrJson = {
        pathArr: pathArr
      };
      sessionStorage.setItem('routerAuth', JSON.stringify(pathArrJson));
    }
  }
});

// init vue-amap
VueAMap.initAMapApiLoader({
  key: 'b5eeb9d7ba595022b68e33f05d792b83',//高德地图开发者KEY
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'], // 插件集合
  v: '1.4.4'
});

/* VUE APP START */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
