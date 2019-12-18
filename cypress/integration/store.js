import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 0 ,
  products: [
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' },
      { id: 3, title: 'Carrot', category: 'vegetable' }
  ]
}
export const mutations = {
  increment (state) { state.count++ }
}

export default new Vuex.Store({
  state,
  mutations
})
