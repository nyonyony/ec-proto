<template>
    <div class="product-list">
        <purchase-step></purchase-step>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <h6 class="headline">{{ product.title }}</h6>
                </v-card-title>
                <v-card-media
                  :src="product.imageUrl"
                  height="200px"
                ></v-card-media>
                <v-card-text>
                    <div class="info--text">{{ product.date | date }}</div>
                    <div>{{ product.description }}</div>
                </v-card-text>
                <!--<v-container class="pt-0 pb-0">-->
                <!--<v-layout row wrap>-->
                <!--<v-flex xs3 offset-xs1>-->
                <!--<v-btn icon class="pink&#45;&#45;text">-->
                <!--<v-icon>favorite</v-icon>-->
                <!--</v-btn>-->
                <!--</v-flex>-->
                <!--<v-flex xs4>-->
                <!--<v-text-field-->
                <!--name="amount"-->
                <!--label="1"-->
                <!--value="1"-->
                <!--min="1"-->
                <!--class="input-group&#45;&#45;focused pb-0"-->
                <!--single-line-->
                <!--&gt;</v-text-field>-->
                <!--</v-flex>-->
                <!--<v-flex xs3>-->
                <!--<v-btn icon class="deep-orange&#45;&#45;text">-->
                <!--<v-icon>add</v-icon>-->
                <!--</v-btn>-->
                <!--</v-flex>-->
                <!--</v-layout>-->
                <!--</v-container>-->
                <v-flex v-if="product.selected" xs12 sm6 pb-4 class="text-xs-center">
                    <v-btn large @click="toggleCart(false)" class="grey lighten-1">カートから外す</v-btn>
                </v-flex>
                <v-flex v-else xs12 sm6 pb-4 class="text-xs-center">
                    <v-btn large @click="toggleCart(true)" class="success">カートに入れる</v-btn>
                </v-flex>

                <v-flex xs12 sm6 pb-4 class="text-xs-center">
                    <v-btn :to="'/products'" class="info">一覧に戻る</v-btn>
                </v-flex>
            </v-card>

            <v-card>
                <v-list three-line>
                    <template v-for="item in items">
                        <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
                        <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
                        <v-list-tile avatar v-else v-bind:key="item.title" router :to="'/customer-products'">
                            <v-list-tile-avatar>
                                <img v-bind:src="item.avatar"/>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    <div>
                                        <v-icon class="grey--text text--lighten-1">star_border</v-icon>
                                        <v-icon class="grey--text text--lighten-1">star_border</v-icon>
                                        <v-icon class="grey--text text--lighten-1">star_border</v-icon>
                                        <v-icon class="grey--text text--lighten-1">star_border</v-icon>
                                        <v-icon class="grey--text text--lighten-1">star_border</v-icon>
                                    </div>
                                </v-list-tile-title>
                                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card>
        </v-flex>
    </div>
</template>

<script>
  import PurchaseStep from '../Partials/PurchaseStep'
  export default {
    props: ['id'],
    computed: {
      product () {
        let product = this.$store.getters.loadedMeetup(this.id)
        console.log(product.selected)
        return product
      }
    },
    data () {
      return {
        items: [
          { header: 'お客様の声' },
          { avatar: 'https://topical.jp/img/no_avatar.png', title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
          { divider: true, inset: true },
          { avatar: 'https://topical.jp/img/no_avatar.png', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend." },
          { divider: true, inset: true },
          { avatar: 'https://topical.jp/img/no_avatar.png', title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?" },
          { divider: true, inset: true },
          { avatar: 'https://topical.jp/img/no_avatar.png', title: 'Birthday gift', subtitle: "<span class='grey--text text--darken-2'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?" },
          { divider: true, inset: true },
          { avatar: 'https://topical.jp/img/no_avatar.png', title: 'Recipe to try', subtitle: "<span class='grey--text text--darken-2'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos." }
        ]
      }
    },
    methods: {
      toggleCart (selected) {
        let product = this.product
        if (selected) {
          product.selected = true
          this.addToCart(product)
        } else {
          product.selected = false
          this.removeFromCart(product)
        }
      },
      addToCart (product, type) {
        let cartType = type || product.type
        this.$store.dispatch('addToCart', {product: product, type: cartType}).catch((error) => {
          product.selected = false
          this.$store.commit('updateProduct', {product: product})
          if (error === 'add-as-addon') {
            this.displayAddonAlert(product)
          } else if (error === 'addon-full') {
            this.displayCartFullAlert()
          } else {
            this.setSnackError(error)
          }
        })
      },
      removeFromCart (product) {
        let bundle = this.$store.getters.bundle
        for (let key of Object.keys(bundle)) {
          for (let productId of bundle[key].content) {
            if (productId === product.id) {
              this.$store.dispatch('removeFromCart', {product: product, type: key}).catch((error) => {
                this.setSnackError(error)
              })
            }
          }
        }
      },
      displayCartFullAlert () {
        this.$swal(
          {
            title: 'これ以上商品を追加できません。',
            showCancelButton: true,
            cancelButtonText: 'キャンセル'
          }
        ).catch(this.$swal.noop)
      },
      displayAddonAlert (product) {
        this.$swal(
          {
            title: '商品枠が一杯です。',
            text: 'アドオンに追加しますか？',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '追加する!',
            cancelButtonText: 'キャンセル'
          }
        ).then((isCOnfirmed) => {
          if (isCOnfirmed) {
            console.log(product)
            product.selected = true
            this.$store.commit('updateProduct', {product: product})
            this.addToCart(product, 'addon')
          }
        }).catch(this.$swal.noop)
      }
    },
    components: { PurchaseStep }
  }
</script>
