import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
/* 引入vuex日志插件 */
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

/* debug为true 为严格模式  */
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict:debug,
  /* 打印日志的插件 ：数组*/
  plugins:debug?[createLogger()]:[]
})
