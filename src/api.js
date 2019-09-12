import axios from '@/axios'
var api = {
  /**
   * 登陆
   */
  login (data){
    return axios.post('/admin/login', data)
  },
  /**
   * 退出
   */
  signout (){
    return axios.get('/admin/singout')
  },
  /**
   * 获取用户信息
   */
  getAdminInfo (){
    return axios.get('/admin/info')
  },
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
    return axios.get('/v1/users/count', {params: data})
  },
  /**
   * 获取订单数量
   */
  getOrderCount (data) {
    return axios.get('/bos/orders/count', {params: data})
  },
  /**
   * 获取订单列表
   */
  getOrderLis (data) {
    return axios.get('/bos/orders', {params: data})
  },
  /**
   * 管理员数量
   */
  adminCount () {
    return axios.get('/admin/count')
  },
  /**
   * 管理员列表
   */
  adminList (data) {
    return axios.get('/admin/all', {params: data})
  },
  /**
   * 获取用户列表
   */
  getUserList (data) {
    return axios.get('/v1/users/list', {params: data})
  },
  /**
   * 获取定位城市
   */
  cityGuess () {
    return axios.get('/v1/cities', {params: {type: 'guess'}})
  },
  /**
   * 获取餐馆列表
   */
  getResturants (data){
    return axios.get('/shopping/restaurants', {params: data})
  },
  /**
   * 获取餐馆数量
   */
  getResturantsCount (){
    return axios.get('/shopping/restaurants/count')
  },
  /**
   * category 种类列表
   */
  foodCategory (){
    return axios.get('/shopping/v2/restaurant/category')
  },
  /**
   * 添加食品种类
   */
  addCategory (data){
    return axios.post('/shopping/addcategory', data)
  },
  /**
   * 更新餐馆信息
   */
  updateResturant (data){
    return axios.post('/shopping/updateshop', data)
  },
  /**
   * 获取搜索地址
   */
  searchplace (cityid, value){
    return axios.get('/v1/pois', {params: {type: 'search', city_id: cityid, keyword: value}})
  },
  /**
   * 删除餐馆
   */
  deleteResturant (restaurant_id) {
    return axios.delete('/shopping/restaurant/' + restaurant_id, {})
  },
  /**
   * 获取当前店铺食品种类
   */
  getCategory (restaurant_id) {
    return axios.get('/shopping/getcategory/' + restaurant_id)
  },
  /**
   * 添加食品
   */
  addFood (data) {
    return axios.post('/shopping/addfood', data)
  },
  /**
   * 获取食品列表
   */
  getFoods (data) {
    return axios.get('/shopping/v2/foods', {params: data})
  },
  /**
   * 获取食品数量
   */
  getFoodsCount (data) {
    return axios.get('/shopping/v2/foods/count', {params: data})
  },
  /**
   * 获取menu列表
   */
  getMenuById (category_id) {
    return axios.get('/shopping/v2/menu/' + category_id)
  },
  /**
   * 获取menu详情
   */
  getMenu (data) {
    return axios.get('/shopping/v2/menu', {params: data})
  },
  /**
   * 更新食品信息
   */
  updateFood (data) {
    return axios.post('/shopping/v2/updatefood', data)
  },
  /**
   * 删除食品
   */
  deleteFood (food_id) {
    return axios.delete('/shopping/v2/food/' + food_id, {})
  },
  /**
   * 获取餐馆详细信息
   */
  getResturantDetail (restaurant_id) {
    return axios.get('/shopping/restaurant/' + restaurant_id)
  },
  /**
   * 添加商铺
   */
  addShop (data) {
    return axios.post('/shopping/addShop', data)
  },
  /**
   * 获取用户分布信息
   */
  getUserCity () {
    return axios.get('/v1/user/city/count')
  }

}
export default api
