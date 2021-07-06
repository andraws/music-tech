<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <sequence />
            <v-row justify="center" align="center" class="my-10">
              <v-card max-width="500px" width="500px" style="absolute bottom">
                <v-container>
                  <v-row align="center" justify="start">
                    <v-col>
                      <v-btn
                        v-if="play"
                        absolute
                        bottom
                        x-large
                        color="primary"
                        @click="playSequence"
                      >
                        <v-icon>mdi-play</v-icon>
                        Play
                      </v-btn>
                      <v-btn
                        v-else
                        absolute
                        bottom
                        x-large
                        dark
                        color="red"
                        @click="stopSequence"
                      >
                        <v-icon>mdi-stop</v-icon>
                        Play
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-slider
                        max="180"
                        min="60"
                        v-model="tempo"
                        step="10"
                        persistent-hint
                        dense
                        hint="Tempo"
                      >
                        <template v-slot:append>
                          <v-text-field
                            v-model="tempo"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                          ></v-text-field>
                        </template>
                      </v-slider>
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                </v-container>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-dialog-bottom-transition>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title class="text-h5"> Welcome To My project </v-card-title>
          <v-card-text class="text-body-1"
            >Andrew Shanaj's Project For MU2300, this dialog is mainly to
            initialize the Tone.JS library!</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" block @click="initialize"> Enter </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-dialog-bottom-transition>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Sequence from "./components/Sequence.vue";

export default Vue.extend({
  name: "App",

  components: {
    Sequence,
  },
  data: () => ({
    tempo: 140,
    dialog: true,
    play: true,
  }),
  methods: {
    initialize() {
      this.dialog = false;
      this.$store.dispatch("init");
    },
    playSequence() {
      if (this.$store.state.playQue.length > 0) {
        this.play = false;
        this.$store.dispatch("playSequence", this.tempo);
      }
    },
    stopSequence() {
      this.play = true;
      this.$store.dispatch("stopSequence");
    },
  },
});
</script>
