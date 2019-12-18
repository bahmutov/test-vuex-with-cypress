/// <reference types="cypress" />
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

describe('mutations', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        count: 0 ,
        products: [
            { id: 1, title: 'Apple', category: 'fruit' },
            { id: 2, title: 'Orange', category: 'fruit' },
            { id: 3, title: 'Carrot', category: 'vegetable' }
        ]
      },
      mutations: {
        increment (state) { state.count++ }
      }
    })
  })

  it('starts at zero', () => {
    expect(store.state.count).to.equal(0)
    expect(store.state.products).to.have.length(3)
  })

  it('INCREMENT', () => {
    store.commit('increment');
    expect(store.state.count).to.equal(1)
  })
})
