<template>
    <v-container>
        <h1>プラン選択</h1>
    </v-container>
</template>

<script>
    export default {
      computed: {
        meetups () {
          return this.$store.getters.loadedMeetups
        }
      }
    }
</script>
