<template>
  <v-container
    style="
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
    "
  >
    <v-row dense>
      <v-col>
        <v-row align="center">
          <v-col>
            <v-row
              v-for="(kit, index) in drumKit"
              :key="index"
              align="center"
              justify="start"
              dense
            >
              <v-col>
                <div class="text-h5" v-text="drumClass[index]"></div>
              </v-col>
              <v-col v-for="timing in cols" :key="timing">
                <beats
                  :kit="kit"
                  :index="index"
                  :time-step="timing"
                  :index-playing="indexPlaying"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row
      ><v-btn
        fab
        bottom
        left
        class="ma-5"
        color="red lighten-1"
        dark
        @click="$store.commit('decrementTimeStep')"
      >
        <v-icon>mdi-minus</v-icon></v-btn
      >
      <v-spacer></v-spacer>
      <v-btn
        fab
        bottom
        right
        class="ma-5"
        color="green"
        dark
        @click="$store.commit('incrementTimeStep')"
      >
        <v-icon>mdi-plus</v-icon></v-btn
      ></v-row
    >
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Players } from "tone";
import Beats from "./Beats.vue";
export default Vue.extend({
  components: { Beats },
  data() {
    return {
      indexPlaying: 0,
    };
  },
  watch: {
    "$store.state.sequenceStep"() {
      this.indexPlaying = this.$store.state.sequenceStep;
    },
  },
  computed: {
    cols() {
      return this.$store.state.timeSteps;
    },
    drumKit() {
      return this.$store.state.drumKit as Players;
    },
    drumClass() {
      return this.$store.state.DRUM_CLASSES;
    },
  },
});
</script>

<style scoped>
</style>