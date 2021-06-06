<template>
  <v-row dense>
    <v-col cols="12">
      <track-list-item
        v-for="track in tape.tracks"
        :tape="tape"
        :track="track"
        :key="track.id"
        :disabled="tape.status == 2"
      ></track-list-item>
    </v-col>
  </v-row>
</template>

<script>
import TrackListItem from "@/components/TrackListItem.vue";

export default {
  components: {
    TrackListItem,
  },
  props: {
    tape: {
      type: Object,
    },
  },
};
</script>

<style></style>
