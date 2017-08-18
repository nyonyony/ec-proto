<template>
  <v-app>
    <v-navigation-drawer temporary v-model="sideNav">
      <v-list>
        <v-list-tile
                v-for="item in menuItems"
                :key="item.title"
                :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary" v-if="($route.path === '/')">
      <v-flex xs5>
        <v-toolbar-title style="margin-left: 0;">
          <router-link to="/" tag="span" class="nav-title">NOLEBO</router-link>
        </v-toolbar-title>
      </v-flex>
    </v-toolbar>
    <v-toolbar dark class="primary" v-else>
      <v-flex xs6>
        <v-btn
          flat
          :to="'/'"
        >
          <v-icon left dark>shopping_cart</v-icon>
          {{bundle.standard.content.length + bundle.premium.content.length}}/{{bundle.standard.max + bundle.premium.max}}
          <span v-if="bundle.addon.content.length > 0" class="red--text">
            &nbsp; + {{bundle.addon.content.length}}/{{bundle.addon.max}}
          </span>
        </v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn
          v-if="canPurchase"
          class="success"
          :to="'/plans'"
        >
          プラン選択
        </v-btn>
        <v-btn
          v-else
          style="background-color: grey !important; color: white !important; opacity: 1;"
          disabled
        >
          商品を5つ選んでください
        </v-btn>
      </v-flex>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main>
    <error-message></error-message>
  </v-app>
</template>

<script>
  import ErrorMessage from './components/Partials/ErrorMessage'
  export default {
    data () {
      return {
        sideNav: false,
        e1: 2
      }
    },
    components: { ErrorMessage },
    computed: {
      menuItems () {
        let menuItems = [
          {icon: 'face', title: 'Sign up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign in', link: '/signin'}
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {icon: 'supervisor_account', title: 'View Meetups', link: '/meetups'},
            {icon: 'room', title: 'Organize Meetup', link: '/meetup/new'},
            {icon: 'person', title: 'Profile', link: '/profile'}
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      bundle () {
        return this.$store.getters.bundle
      },
      canPurchase () {
        return this.$store.getters.canPurchase
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>

<style>
  .card__media__background {
    background-size: contain !important;
  }
  .nav-title {
    font-size: 14px;
    cursor: pointer;
  }
</style>
