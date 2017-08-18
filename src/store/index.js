import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import initProducts from './initProducts'
import userProducts from './userProducts'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: initProducts,
    userProducts: userProducts,
    user: null,
    bundle: {
      premium: {max: 2, content: []},
      standard: {max: 3, content: []},
      addon: {max: 3, content: []}
    },
    errorMessage: '',
    addonModal: false,
    isAddonAdded: false,
    isPurchaseConfirmed: false
  },
  mutations: {
    updateProduct (state, payload) {
      state.loadedMeetups[payload.index] = payload.product
    },
    setPurchaseConfirmed (state, payload) {
      state.isPurchaseConfirmed = payload
    },
    setAddonModal (state, payload) {
      state.addonModal = payload
    },
    addToCart (state, payload) {
      state.isAddonAdded = (payload.type === 'addon')
      state.bundle[payload.type].content.push(payload.product.id)
    },
    removeAllFromCart (state) {
      state.bundle.standard.content = []
      state.bundle.premium.content = []
    },
    removeFromCart (state, payload) {
      state.bundle[payload.type].content.splice(state.bundle[payload.type].content.indexOf(payload.product.id), 1)
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setErrorMessage (state, payload) {
      state.errorMessage = payload
    }
  },
  actions: {
    updateProduct ({commit, getters}, product) {
      let index = getters.meetupIndex(product.id)
      commit('updateProduct', {index: index, product: product})
    },
    addToCart ({commit, getters}, payload) {
      return new Promise((resolve, reject) => {
        let bundle = getters.bundle
        if (bundle[payload.type].content.length >= bundle[payload.type].max) {
          if (payload.type === 'addon') reject('addon-full')
          reject('add-as-addon')
        } else {
          let index = getters.meetupIndex(payload.product.id)
          commit('updateProduct', {index: index, product: payload.product})
          commit('addToCart', payload)
          resolve()
        }
      })
    },
    removeAllFromCart ({commit, getters}) {
      return new Promise((resolve, reject) => {
        commit('removeAllFromCart')
        resolve()
      })
    },
    removeFromCart ({commit, getters}, payload) {
      return new Promise((resolve, reject) => {
        let bundle = getters.bundle
        if (bundle[payload.type].content.length <= 0) {
          reject('削除対象がありません')
        } else {
          commit('removeFromCart', payload)
          resolve()
        }
      })
    },
    createMeetup ({commit}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        id: 'fjaodfjaofda'
      }
      // Reach out to firebase and store it
      commit('createMeetup', meetup)
    },
    signUserUp ({commit}, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid,
              registeredMeetups: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid,
              registeredMeetups: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    userProducts (state) {
      return state.userProducts
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    meetupIndex (state) {
      return (meetupId) => {
        return state.loadedMeetups.findIndex((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    user (state) {
      return state.user
    },
    bundle (state) {
      return state.bundle
    },
    errorMessage (state) {
      return state.errorMessage
    },
    addonModal (state) {
      return state.addonModal
    },
    isAddonAdded (state) {
      return state.isAddonAdded
    },
    canPurchase (state) {
      let bundle = state.bundle
      return (
        bundle.standard.content.length >= bundle.standard.max &&
        bundle.premium.content.length >= bundle.premium.max
      )
    },
    isPurchaseConfirmed (state) {
      return state.isPurchaseConfirmed
    }
  }
})
