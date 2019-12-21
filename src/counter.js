import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const mutations = {
  increment(state, n = 1) {
    state.count += n
  },
}

const actions = {
  incrementAsync({ commit }, n = 1) {
    setTimeout(() => {
      commit('increment', n)
    }, 100)
  },
}

const counterStoreFactory = () => {
  const state = {
    count: 0,
  }

  return new Vuex.Store({
    state,
    mutations,
    actions,
  })
}
export default counterStoreFactory
