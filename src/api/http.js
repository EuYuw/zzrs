/**
 *  axios
 * Created by wy on 2018/11/12 0012.
 */
import axios from 'axios';
//import qs from 'qs';
import router from '../router/router'
import {Message} from 'element-ui';

axios.defaults.timeout = 10000; //超时终止请求
axios.defaults.baseURL = ''; //配置请求地址
//axios.defaults.withCredentials = true;

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = '';
}

//http request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Message({
      message: error.message,
      type: 'error'
    });
    return Promise.reject(error);
  });

//http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data;
    } else {
      throw '' + response.statusText;
    }
  },
  error => {
    let flag = true;
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if(sessionStorage.getItem('UT') == 'manager'){
            router.push({name: 'loginFME', params: {}});
          }else{
            router.push({name: 'login', params: {}});
          }
          sessionStorage.removeItem('UT');
          break;
        case 400:
          /*Message({
            message: '请求参数错误',
            type: 'error'
          });*/
          break;
        case 403:
          Message({
            message: '拒绝访问',
            type: 'warning'
          });
          break;
        case 404:
          Message({
            message: '请求资源路径错误',
            type: 'error'
          });
          flag = false;
          break;
        case 504:
          Message({
            message: '连接服务超时或服务未启动',
            type: 'error'
          });
          flag = false;
          break;
        default:
          break;
      }
    }
    if(flag){
      return Promise.reject(error);
    }else{
      return false;
    }
  });

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function GET(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function POST(url, data = {}) {//url,data,config
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response);
      }).catch(err => {
      reject(err);
    })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function PATCH(url, data = {}) {//url,data,config
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response);
      }).catch(err => {
      reject(err);
    })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function PUT(url, data = {}) {//url,data,config
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response);
      }).catch(err => {
      reject(err);
    });
  })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function DEL(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {data: data})
      .then(response => {
        resolve(response);
      }).catch(err => {
      reject(err);
    });
  })
}
