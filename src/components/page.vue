<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-row>
          <sequence />
        </v-row>
        <v-row> </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Sequence from "./Sequence.vue";
export default Vue.extend({
  components: {
    Sequence,
  },
});
</script>