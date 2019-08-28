import axios from '@/axios'
var api = {
  /**
   * 用户注册量
   */
  userCount (date) {
    return axios.get('/statis/user/' + date + '/count')
  },
  /**
   * 某一天订单数量
   */
  orderCount (date) {
    return axios.get('/statis/order/' + date + '/count')
  },
  /**
   * 某一天管理员注册量
   */
  adminDayCount (date) {
    return axios.get('/statis/admin/' + date + '/count')
  },
  /**
   * 获取用户数量
   */
  getUserCount (data) {
    return axios.get('/v1/users/count', data)
  },
  /**
   * 获取订单数量
   */
  getOrderCount (data) {
    return axios.get('/bos/orders/count', data)
  },
  /**
   * 管理员数量
   */
  adminCount () {
    return axios.get('/admin/count')
  },

}
export default api
