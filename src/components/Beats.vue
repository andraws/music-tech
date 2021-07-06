<template>
  <v-card
    height="80px"
    width="80px"
    v-ripple="{ center: true }"
    outlined
    :elevation="elevation"
    :color="color"
    :style="popout"
    :class="textColor"
    @click="cardClicked()"
    @contextmenu="show"
  >
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <div class="text-subtitle-1 text-center">
          {{ velocity.title }}
        </div>
      </v-row>
    </v-container>
    <v-menu
      v-model="showMenu"
      absolute
      :position-x="x"
      :position-y="y"
      offset-y
    >
      <v-list>
        <v-list-item-group
          v-model="menuItemIndex"
          mandatory
          color="indigo"
          @change="playTone"
        >
          <v-list-item v-for="(item, index) in menuItems" :key="index">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-card>
</template>

<script lang="ts">
import { Player, Players } from "tone";
import Vue, { PropType } from "vue";
import { IPlayQueItem } from "../store/index";
export default Vue.extend({
  props: {
    index: {
      type: Number,
    },
    kit: {
      type: Object as PropType<Players>,
    },
    timeStep: {
      type: Number,
    },
    indexPlaying: {
      type: Number,
    },
  },
  data() {
    return {
      id: 0,
      textColor: "text--black",
      showMenu: false,
      x: 0,
      y: 0,
      menuItems: [{ title: "High" }, { title: "Medium" }, { title: "Low" }],
      menuItemIndex: 1,
      color: "",
      isPressed: false,
    };
  },
  computed: {
    elevation() {
      if (this.indexPlaying === this.timeStep + 1 && this.isPressed) {
        return 24;
      } else {
        return 8;
      }
    },
    popout() {
      if (this.indexPlaying === this.timeStep + 1 && this.isPressed) {
        return "transform: translate(-5px, -5px);";
      } else return "";
    },
    velocity() {
      if (this.menuItemIndex === 0) return { title: "High", value: "high" };
      else if (this.menuItemIndex === 1)
        return { title: "Medium", value: "med" };
      else return { title: "Low", value: "low" };
    },
    playBackItem(): IPlayQueItem {
      return {
        id: this.id,
        timeStep: this.timeStep,
        kit: this.kit,
        velocity: this.velocity.value,
      };
    },
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    show(e: any) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    async cardClicked() {
      if (!this.isPressed) {
        this.color = "green";
        this.textColor = "white--text";
        this.setTone();
        this.isPressed = !this.isPressed;
      } else {
        this.color = "";
        this.textColor = "black--text";
        this.removeTone();
        this.isPressed = !this.isPressed;
      }
    },
    setTone() {
      this.playTone();
      this.id = this.$store.getters.getID;
      this.$store.commit("addPlayQueItem", this.playBackItem);
    },
    removeTone() {
      this.$store.commit("removePlayQueItem", this.playBackItem);
    },
    playTone() {
      this.kit.player(this.velocity.value).start();
    },
  },
});
</script>

