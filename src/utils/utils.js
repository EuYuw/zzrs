/**
 *  utils 工具类
 */
export const formatUtils = {
  numPoint: str => {//替换除数字 . 之外的
    return str.replace(/[^\d\.]/g, "");
  },
  noCHNAndSpec: str => {//替换除字母 数字 . _ -之外的
    return str.replace(/[^a-zA-Z\d\.\-\_]/g, "");
  },
  num: str => {//替换除数字之外的
    return str.replace(/[^\d]/g, "");
  }
}

export const regUtils = {
  email: str => {// email
    return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{1,})$/g.test(str);
  },
  tel: str => {//tel
    return /^1\d{10}$/g.test(str);
  }
}
