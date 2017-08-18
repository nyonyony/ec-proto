<template>
    <v-snackbar
      :timeout="timeout"
      :error="error"
      :bottom="bottom"
      v-model="errorMessage"
    >
        {{ errorMessage }}
        <v-btn flat @click.native="clearMessage">Close</v-btn>
    </v-snackbar>
</template>

<script>
  export default {
    computed: {
      errorMessage () {
        return this.$store.getters.errorMessage
      }
    },
    data () {
      return {
        timeout: 6000,
        error: true,
        bottom: true
      }
    },
    methods: {
      clearMessage () {
        this.$store.commit('setErrorMessage', '')
      }
    }
  }
</script>
