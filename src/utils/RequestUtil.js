
import { functionTypeAnnotation } from "@babel/types";
import axios from "axios";
import {ElMessageBox,ElMessage} from "element-plus"
const httpManage = {};

const service = axios.create({
  baseURL: "/ecolab", //
  timeout: 30000
});
function getToken() {
  const token = sessionStorage.getItem("token");
  return token;
}
// 添加一个请求拦截器
service.interceptors.request.use(
  function(config) {
    const token = getToken();
    if (token == null && config.url !== "/user/auth/login" && config.url !== "/device/equipment/downloadConfiguration") {
      ElMessageBox({
        message: "登入已过期",
        showClose: false,
        callback: function() {
          document.location.hash = "#/Login";
        }
      });
      throw new Error("");
    }
    config.headers.Authorization = "Bearer " + token;
    config.headers['Content-Type'] = "application/json;charset=utf-8"
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 添加一个响应拦截器
service.interceptors.response.use(
  function(response) {
    //接口调用失败时关闭遮盖层
    if (response != null) {
    
    //   const err = new Error();
    //   err.response = response;
    //   err.message = "";
    //   if (err.response.status === 504) {
    //     err.message = "网关连接超时，请重试";
    //   } else if (err.response.status === 500) {
    //     err.message = "服务器存在错误";
    //   }
    //   if (response.data.result === "fail") {
    //     err.message = response.data.msg;
    //   }
    //   if (err.message) {
    //     ElMessage({ 
    //       message: err.message ,
    //       type:'error'
    //     });
    //     return Promise.reject(err);
    //   }
    }
    return response;
  },
  function(error) {
    // Do something with response error
    // if (service.isCancel(error)) { // 取消请求的情况下，终端Promise调用链
    //   return new Promise(() => {});
    // } else {
    //   console.log(error);
    //   return Promise.reject(error);
    // }
  }
);

const CancelToken = axios.CancelToken;

function get(option = { url: '', params: {}, cancel:function(){}, success:function({}){}}) {
  return service
    .get(option.url, {
      params: option.params,
      cancelToken: new CancelToken(function executor(c) {
        // if (option.cancel) {
        //   option.cancel.cancel = c;
        // }
      })
    })
    .then(res => {
      if (option.success) {
        option.success(res.data);
      }
      return res;
    });
}
function post(option = { url: "", params: {}, success: function({}) {}, error: function({}) {} }) {
  let cancelToken;
 
  return service.post(option.url, option.params, {
    // cancelToken: new CancelToken(function executor(c) {
    //   httpManage.cancel = c;
    // })
  }).then(res => {
  
    if (option.success) {
      try {
        option.success(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    return res;
  }).catch(res => { if (option.error) option.error(res); });
}
export default {
  get,
  post,
};

