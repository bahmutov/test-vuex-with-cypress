import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 0,
}
export const mutations = {
  increment(state) {
    state.count++
  },
}

export default new Vuex.Store({
  state,
  mutations,
})
