<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 sm6 class="text-xs-center text-sm-right">
                <v-btn large to="/products" class="info">商品を選ぶ</v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="mt-2">
            <v-flex xs12>
                <v-carousel>
                    <v-carousel-item
                            style="cursor: pointer"
                            v-for="meetup in meetups"
                            v-bind:src="meetup.imageUrl"
                            :key="meetup.id"
                            @click="onLoadMeetup(meetup.id)"
                    >
                        <div class="title">
                            {{ meetup.title }}
                        </div>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout>
        <v-dialog v-model="dialog" lazy absolute class="margin: 0; width: auto">
            <v-card>
                <v-card-media>
                    <!--<iframe width="100%" height="auto" src="https://www.youtube.com/embed/FXY1UyQfSFw?list=PL55RiY5tL51qxUbODJG9cgrsVd7ZHbPrt" frameborder="0" allowfullscreen></iframe>-->
                    <iframe src="https://player.vimeo.com/video/87979670?autoplay=1" width="100%" height="auto" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                </v-card-media>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">閉じる</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    export default {
      computed: {
        meetups () {
          return this.$store.getters.featuredMeetups
        }
      },
      data () {
        return {
          dialog: true
        }
      },
      methods: {
        onLoadMeetup (id) {
          this.$router.push('/products/' + id)
        }
      }
    }
</script>

<style scoped>
    .title {
        position: absolute;
        bottom: 50px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 2em;
        padding: 20px;
    }
</style>
