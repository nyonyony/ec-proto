<template>
  <div>
    <v-card class="fixed-footer">
      <v-layout row no-wrap class="horizontal-scroll" @click.stop="dialog = !dialog">
        <template v-for="key in Object.keys(bundle)">
          <v-btn v-for="(product, index) in bundle[key].content" :key="product.id" disabled
                 flat icon :class="key + index + ' ' + key + ' footer-product'">
            <v-icon>done</v-icon>
          </v-btn>
          <v-btn v-for="i in (bundle[key].max - bundle[key].content.length)" :key="i" disabled
                 flat icon :class="key + (bundle[key].content.length + i) + ' ' + key + ' footer-product'">
            <v-icon>border_inner</v-icon>
          </v-btn>
        </template>
      </v-layout>
    </v-card>
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" :overlay=false>
      <v-card>
        <v-toolbar dark class="primary">
          <v-toolbar-title>カートの中身</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.stop="dialog = false">
              閉じる
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-flex xs12 v-if="bundleProducts.length <= 0">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-icon x-large class="cart-empty">remove_shopping_cart</v-icon>
              </v-flex>
              <v-flex xs12>
                <h2 class="text-xs-center">カートに商品が<br>ありません</h2>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex v-else v-for="prodWithType in bundleProducts" :key="prodWithType.product.id" xs12 sm10 md8 offset-sm1 offset-md2>
          <v-card>
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs1>
                  <v-checkbox v-model="prodWithType.product.selected" @click.native.stop="" @change="toggleCart(prodWithType.product.id, prodWithType.product.selected, $event)"></v-checkbox>
                </v-flex>
                <v-flex xs4>
                  <v-card-media
                    :src="prodWithType.product.imageUrl"
                    :class="prodWithType.product.type"
                    height="125px"
                    contain
                  ></v-card-media>
                </v-flex>
                <v-flex xs7>
                  <div>
                    <div>{{ prodWithType.product.title }}</div>
                  </div>
                  <div class="text-xs-left">
                    <v-chip v-for="(tag, index) in prodWithType.product.tags" label outline :key="prodWithType.product + index"
                            class="ml-0 mt-1 mb-1"
                            :style="{'color': tag.color, 'border-color': tag.color}"
                    >
                      {{ tag.label }}
                    </v-chip>
                  </div>
                  <div>
                    <v-icon v-for="i in prodWithType.product.rate" class="orange--text text--lighten-1" :key="i">star</v-icon>
                    <v-icon v-for="i in (5 - prodWithType.product.rate)" class="grey--text text--lighten-1" :key="i">star_border</v-icon>
                  </div>
                  <v-card-actions>
                    <v-btn :to="'/products/' + prodWithType.product.id" class="warning">
                      <v-icon left light>arrow_forward</v-icon>
                      詳しく見る
                    </v-btn>
                  </v-card-actions>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    computed: {
      bundle () {
        let bundle = this.$store.getters.bundle
        this.scrollTo()
        if (this.$store.getters.canPurchase) {
          if (!this.$store.getters.isPurchaseConfirmed) this.displayConfirmationAlert()
          this.$store.commit('setPurchaseConfirmed', true)
        } else {
          this.$store.commit('setPurchaseConfirmed', false)
        }
        return bundle
      },
      bundleProducts () {
        let bundledProducts = []
        for (let type of Object.keys(this.bundle)) {
          for (let productId of this.bundle[type].content) {
            let product = this.$store.getters.loadedMeetup(productId)
            if (product) {
              let bundledProduct = {
                type: type,
                product: product
              }
              bundledProducts.push(bundledProduct)
            }
          }
        }
        return bundledProducts
      }
    },
    data () {
      return {
        prevInfo: {bundle: null, count: 0},
        dialog: false,
        canPurchase: false
      }
    },
    methods: {
      scrollTo () {
        let isAddon = this.$store.getters.isAddonAdded
        let position = isAddon ? '1000px' : '0'
        window.$('.horizontal-scroll').animate({scrollLeft: position}, 'fast', 'swing')
      },
      toggleCart (id, selected, event) {
        console.log(selected)
        console.log('test')
        let product = this.$store.getters.loadedMeetup(id)
        if (selected) {
          this.addToCart(product)
        } else {
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
      displayConfirmationAlert () {
        this.$swal(
          {
            title: '商品を購入できる状態になりました。',
            text: 'xxxxxxxxxx',
            showCancelButton: true,
            confirmButtonColor: '#4caf50',
            confirmButtonText: 'プラン選択へ',
            cancelButtonText: '他の商品を追加する'
          }
        ).then((isConfirmed) => {
          if (isConfirmed) {
            this.$router.push('/plans')
          }
        }).catch(this.$swal.noop)
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
    }
  }
</script>

<style scoped>
  .btn.premium {
    color: green;
  }
  .btn.standard {
    color: blue;
  }
  .btn.addon {
    color: red;
  }
  .fixed-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }
  .footer-product {
    min-width: 20%;
    width: 20%;
    margin-left: 0;
    margin-right: 0;
    opacity: 1;
  }
  .horizontal-scroll {
    overflow-x: scroll;
    width: 100%;
  }
  .cart-empty {
    width: 100%;
    height: 40vh;
    font-size: 10rem;
  }
</style>
