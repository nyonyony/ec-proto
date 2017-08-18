import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import VueSweetAlert2 from 'vue-sweetalert2'
import jquery from 'jquery'

window.$ = window.jQuery = jquery

Vue.use(Vuetify)
Vue.use(VueSweetAlert2)
Vue.config.productionTip = false

Vue.filter('date', DateFilter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyDPiPbqthPOMDaYtu3UqN-Cm00iQrJDfSc',
      authDomain: 'youtube-devmeetup-4a44c.firebaseapp.com',
      databaseURL: 'https://youtube-devmeetup-4a44c.firebaseio.com',
      projectId: 'youtube-devmeetup-4a44c',
      storageBucket: 'youtube-devmeetup-4a44c.appspot.com'
    })
  }
})
