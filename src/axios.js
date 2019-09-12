import axios from 'axios'
axios.defaults.baseURL = '//elm.cangdu.org'
axios.defaults.withCredentials = true
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   config.params = {
//     ...config.params,
//     appkey: 'demo13_1545210570249'
//   }
//   return config;
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });

export default axios
