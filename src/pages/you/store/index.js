import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import global from './modules/global'
import user from './modules/user'
import dataInfo from './modules/getDatas'
Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    user,
    global,
    dataInfo
  },
  getters
})

export default Store
