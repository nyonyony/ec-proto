<template>
    <div>
        <v-stepper v-model="e1">
            <v-stepper-header>
                <v-stepper-step step="1" :complete="e1 > 1">Name of step 1</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2" :complete="e1 > 2">Name of step 2</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Name of step 3</v-stepper-step>
            </v-stepper-header>
        </v-stepper>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        e1: 0
      }
    }
  }
</script>
