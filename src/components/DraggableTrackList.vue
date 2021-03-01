<template>
  <v-list>
    <draggable
      v-model="tracks"
      group="tracks"
      @start="drag = true"
      @end="drag = false"
      handle=".handle"
    >
      <div
        v-for="(track, i) in tracks"
        :key="track.file ? track.file.name + i : track.title + i"
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-icon x-large class="handle">mdi-drag</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="py-1">
            <v-text-field
              :prefix="(i + 1).toString().padStart(2, '0')"
              dense
              outlined
              :hint="track.file ? track.file.name : null"
              :placeholder="
                track.file
                  ? track.file.name.split('.').slice(0, -1).join('.')
                  : null
              "
              :persistent-hint="!!track.file"
              v-model="track.title"
              :hide-details="hideDetails"
              :rules="disableRules ? [] : [commonRules.required]"
            ></v-text-field>
          </v-list-item-content>
          <v-list-item-action
            ><v-btn
              text
              v-if="!noDelete"
              @click="tracks = tracks.filter((item) => item !== track)"
              ><v-icon>mdi-close</v-icon></v-btn
            ></v-list-item-action
          >
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </draggable>
  </v-list>
</template>

<script>
import Draggable from "vuedraggable";
import commonRules from "../mixins/CommonRules";

export default {
  mixins: [commonRules],
  components: {
    Draggable,
  },
  props: {
    value: {
      type: Array,
    },
    files: {
      type: Array,
    },
    disableRules: {
      type: Boolean,
      default: false,
    },
    noDelete: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    suggestTrackName(track) {
      return track.file ? track.file.name : track.title;
    },
  },
  watch: {
    value(newVal) {
      this.tracks = newVal;
    },
    tracks: {
      deep: true,
      handler() {
        this.$emit("input", this.tracks);
      },
    },
  },
  data() {
    return {
      drag: false,
      tracks: [],
    };
  },
  created() {
    this.tracks = this.value;
  },
};
</script>

<style scoped>
.handle {
  cursor: move;
}
</style>
