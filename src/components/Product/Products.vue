<template>
    <div class="product-list">
        <purchase-step></purchase-step>
        <v-flex v-for="product in products" :key="product.id" xs12 sm10 md8 offset-sm1 offset-md2>
            <v-card>
                <v-container fluid grid-list-lg>
                    <v-layout row>
                        <v-flex xs1>
                            <v-checkbox v-model="product.selected" @change="toggleCart(product.id, product.selected)"></v-checkbox>
                        </v-flex>
                        <v-flex xs4>
                            <router-link :to="'/products/' + product.id" tag="span" style="cursor: pointer">
                                <v-card-media
                                  :src="product.imageUrl"
                                  :class="product.type"
                                  height="125px"
                                  contain
                                ></v-card-media>
                            </router-link>
                        </v-flex>
                        <v-flex xs7>
                            <router-link :to="'/products/' + product.id" tag="span" style="cursor: pointer">
                                <div>
                                    <div>{{ product.title }}</div>
                                </div>
                                <div class="text-xs-left">
                                    <v-chip v-for="(tag, index) in product.tags" label outline :key="product.id + index"
                                            class="ml-0 mt-1 mb-1"
                                            :style="{'color': tag.color, 'border-color': tag.color}"
                                    >
                                        {{ tag.label }}
                                    </v-chip>
                                </div>
                                <div>
                                    <v-icon v-for="i in product.rate" class="orange--text text--lighten-1" :key="i">star</v-icon>
                                    <v-icon v-for="i in (5 - product.rate)" class="grey--text text--lighten-1" :key="i">star_border</v-icon>
                                </div>
                                <v-card-actions>
                                    <v-btn :to="'/products/' + product.id" class="warning">
                                        <v-icon left light>arrow_forward</v-icon>
                                        詳しく見る
                                    </v-btn>
                                </v-card-actions>
                            </router-link>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-flex>
        <shopping-cart></shopping-cart>
    </div>
</template>

<script>
    import PurchaseStep from '../Partials/PurchaseStep'
    import ShoppingCart from '../Partials/ShoppingCart'
    export default {
      computed: {
        products () {
          return this.$store.getters.loadedMeetups
        }
      },
      components: { PurchaseStep, ShoppingCart },
      data () {
        return {
          e2: 3,
          ex3: true,
          errorMsg: 'test'
        }
      },
      methods: {
        toggleCart (id, selected) {
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
    .product-list {
        margin-bottom: 48px;
    }
    .premium {
        border: 1px solid green;
    }
    .standard {
        border: 1px solid blue;
    }
    .addon {
        border: 1px solid red;
    }
</style>
