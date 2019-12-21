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

  it('compares entire state object', () => {
    expect(store.state).to.deep.equal({
      count: 0,
    })
    // equivalent assertion
    cy.wrap(store)
      .its('state')
      .should('deep.equal', {
        count: 0,
      })
  })

  it('saves objects like checkpoints', () => {
    cy.wrap(store)
      .its('state')
      .then(Cypress._.cloneDeep)
      .should('deep.equal', {
        count: 0,
      })
    cy.wrap(store).invoke('commit', 'increment', 10)
    cy.wrap(store)
      .its('state')
      .then(Cypress._.cloneDeep)
      .should('deep.equal', {
        count: 10,
      })
  })
})

describe('store actions', () => {
  let store

  beforeEach(() => {
    store = storeFactory()
  })

  it.skip('can be async (fails)', () => {
    store.dispatch('incrementAsync', 2)
    expect(store.state.count).to.equal(2)
  })

  it('can be async (passes)', () => {
    store.dispatch('incrementAsync', 2)
    cy.wrap(store.state) // command
      .its('count') // command
      .should('equal', 2) // assertion
  })
})

describe('spying on mutations', () => {
  let store

  beforeEach(function() {
    store = storeFactory()
    // save Vuex context in test object
    this.context = store._modules.root.context
  })

  it('calls commit "increment" in the store', () => {
    cy.spy(store._modules.root.context, 'commit').as('commit')
    store.dispatch('incrementAsync', 2)
    cy.wrap(store.state)
      .its('count')
      .should('equal', 2)
    // we can also assert directly on the spies
    // thanks for Sinon-Chai bundled with Cypress
    // https://on.cypress.io/assertions#Sinon-Chai
    cy.get('@commit').should('have.been.calledOnce')
  })

  it('spy retries assertion', () => {
    cy.spy(store._modules.root.context, 'commit').as('commit')
    store.dispatch('incrementAsync', 2)
    store.dispatch('incrementAsync', 5)
    cy.get('@commit').should('have.been.calledTwice')
  })

  it('spies on specific call', () => {
    cy.spy(store._modules.root.context, 'commit')
      .withArgs('increment', 5)
      .as('commit5')
    store.dispatch('incrementAsync', 2)
    store.dispatch('incrementAsync', 5)
    cy.get('@commit5').should('have.been.calledOnce')
  })

  it('incrementAsync calls increment mutation (mutations handler)', () => {
    cy.spy(store._mutations.increment, '0').as('increment')
    store.dispatch('incrementAsync', 2)
    cy.wrap(store.state) // command
      .its('count') // command
      .should('equal', 2) // assertion
  })

  it('stubs increment commit', () => {
    // allow all mutations to go through
    // but ("increment", 5) will call our fake function
    cy.stub(store._modules.root.context, 'commit')
      .callThrough()
      .withArgs('increment', 5)
      .callsFake((name, n) => {
        // confirm we are only stubbing increments by 5
        expect(n).to.equal(5)
        // call the original method, but pass a different value
        store._modules.root.context.commit.wrappedMethod(name, 100)
      })

    store.dispatch('incrementAsync', 2)
    store.dispatch('incrementAsync', 5)

    // our stub will turn increment by 5 to increment by 100 😃
    cy.wrap(store.state)
      .its('count')
      .should('equal', 102)
  })

  it('grabs context', function() {
    // save created spy in local variable
    const commit = cy.spy(this.context, 'commit')
    store.dispatch('incrementAsync', 2)
    // use Cypress retry-ability to wait for
    // the spy to be called once
    cy.wrap(commit).should('have.been.calledOnce')
  })

  it('uses alias', function() {
    // save created spy as an alias
    cy.spy(this.context, 'commit').as('commit')
    store.dispatch('incrementAsync', 2)
    // use Cypress retry-ability to wait for
    // the spy to be called once
    cy.get('@commit').should('have.been.calledOnce')
  })
})
