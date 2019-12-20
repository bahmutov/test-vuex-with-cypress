import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const mutations = {
  increment(state, n = 1) {
    state.count += n
  },
}

const counterStoreFactory = () => {
  const state = {
    count: 0,
  }
  return new Vuex.Store({
    state,
    mutations,
  })
}
export default counterStoreFactory
