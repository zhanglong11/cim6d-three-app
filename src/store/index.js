import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'
import userPower from './modules/user-power' // 用户权限
import systemConfig from './modules/systemConfig'
import project from './modules/project'
import addCache from './modules/addCache' // 所有新建页面临时缓存

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    project,
    userPower,
    systemConfig,
    addCache
  },
  getters
})

export default store
