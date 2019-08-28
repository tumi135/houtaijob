import Vue from 'vue'
import Router from 'vue-router'
const layout = () => import('../components/layout')
const index = () => import('../page/index')
const userList = () => import('../page/userList')
const shopList = () => import('../page/shopList')
const foodList = () => import('../page/foodList')
const orderList = () => import('../page/orderList')
const adminList = () => import('../page/adminList')
const addShop = () => import('../page/addShop')
const addGoods = () => import('../page/addGoods')
const visitor = () => import('../page/visitor')
const vueEdit = () => import('../page/vueEdit')
const adminSet = () => import('../page/adminSet')
const explain = () => import('../page/explain')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/layout',
      name: 'layout',
      component: layout,
      children: [
        {
          path: 'index',//首页
          name: 'index',
          component: index
        },{
          path: 'userList',//用户列表
          name: 'userList',
          component: userList
        },{
          path: 'shopList',//商家列表
          name: 'shopList',
          component: shopList
        },{
          path: 'foodList',//食品列表
          name: 'foodList',
          component: foodList
        },{
          path: 'orderList',//订单列表
          name: 'orderList',
          component: orderList
        },{
          path: 'adminList',//管理员列表
          name: 'adminList',
          component: adminList
        },{
          path: 'addShop',//添加商铺
          name: 'addShop',
          component: addShop
        },{
          path: 'addGoods',//添加商铺
          name: 'addGoods',
          component: addGoods
        },{
          path: 'visitor',//添加商铺
          name: 'visitor',
          component: visitor
        },{
          path: 'vueEdit',//文本编辑
          name: 'vueEdit',
          component: vueEdit
        },{
          path: 'adminSet',//管理员设置
          name: 'adminSet',
          component: adminSet
        },{
          path: 'explain',//说明
          name: 'explain',
          component: explain
        }
      ]
    }
  ]
})
