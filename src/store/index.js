import Vue from 'vue'
import Vuex from 'vuex'
import api from "../api";

Vue.use(Vuex)

const state = {
  adminInfo: {
    avatar: 'default.jpg'
  }
}
const mutations = {
  saveAdminInfo(state, adminInfo){
    state.adminInfo = adminInfo
  }
}
const actions = {
  async getAdminData({commit}){
    try{
      const res = await api.getAdminInfo()
      if (res.data.status == 1) {
        commit('saveAdminInfo', res.data.data)
      }else{
        throw new Error(res.data.type)
      }
    }catch(err){
      // console.log(err.message)
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
})
