/**
 *  permission store
 */
import {constRouterMap, managerRouter, portalRouter} from '@/router/router'

const permission = {
  namespaced: true,
  state: {
    routers: constRouterMap,
    willAddRouter: []
  },
  mutations: {
    createRouter(state, routerArr) {
      state.willAddRouter = routerArr;
      state.routers = constRouterMap.concat(routerArr);
    },
    resetRouter(state) {
      state.routers = constRouterMap;
      state.willAddRouter = [];
    }
  },
  actions: {
    createNewRouter({commit}, listFun) {
      return new Promise(resolve => {
        let newRouter = [];
        if (sessionStorage.getItem('UT') == 'portal') {
          newRouter = portalRouter.filter(v => {
            if (listFun.indexOf(v.code) === -1) {
              return false;
            } else {
              if (v.children && v.children.length > 0) {
                v.children = v.children.filter(child => {
                  if (listFun.indexOf(child.code) === -1) {
                    return false;
                  } else {
                    return child;
                  }
                });
              }
              return v;
            }
          });
          commit('createRouter', portalRouter);
        }
        if (sessionStorage.getItem('UT') == 'manager') {
          newRouter = managerRouter.filter(v => {
            if (listFun.indexOf(v.code) === -1) {
              return false;
            } else {
              if (v.children && v.children.length > 0) {
                v.children = v.children.filter(child => {
                  if (listFun.indexOf(child.code) === -1) {
                    return false;
                  } else {
                    return child;
                  }
                });
              }
              return v;
            }
          });
          commit('createRouter', managerRouter);
        }
        //commit('createRouter', newRouter);
        resolve();
      })
    }
  }
};
export default permission
