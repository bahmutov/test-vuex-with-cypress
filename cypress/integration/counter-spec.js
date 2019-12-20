/// <reference types="cypress" />
import { mutations } from '../../src/counter'
import storeFactory from '../../src/counter'

describe('mutations', () => {
  context('increment', () => {
    const { increment } = mutations
    it('INCREMENT', () => {
      const state = { count: 0 }
      increment(state)
      expect(state.count).to.equal(1)
    })

    it('increments the state', () => {
      // wrapped state object will be passed
      // to the "increment" callback
      // which will return new object
      cy.wrap({ count: 0 })
        .then(increment)
        // and the next assertion will run against
        // the updated state
        .should('have.property', 'count', 1)
    })

    it('increments several times', () => {
      cy.wrap({ count: 0 })
        .then(increment)
        .then(increment)
        .then(increment)
        .should('deep.equal', { count: 3 })

      cy.wrap({ count: -1 })
        .then(increment)
        .then(increment)
        .should('deep.equal', { count: 1 })
    })

    it('increments by 5', () => {
      cy.wrap({ count: 0 })
        .then(state => increment(state, 5))
        .should('deep.equal', { count: 5 })
    })
  })
})

describe('store commits', () => {
  let store

  beforeEach(() => {
    store = storeFactory()
  })

  it('starts with zero', () => {
    // it is a good idea to add assertion message
    // as the second argument to "expect(value, ...)"
    expect(store.state.count, 'initial value').to.equal(0)
    store.commit('increment', 4)
    expect(store.state.count, 'changed value').to.equal(4)
  })

  it('starts with zero again', () => {
    expect(store.state.count, 'initial value').to.equal(0)
  })
})
