<template>
  <v-card class="my-2" elevation="0" outlined>
    <v-row dense class="pa-2" align="center">
      <v-col cols="12" sm="12" md="4">
        <div>
          <strong>{{ track.title }}</strong>
        </div>
        <div>{{ tape.artist.name }}</div>
      </v-col>
      <v-col cols="auto" class="mr-3">
        <v-btn
          fab
          small
          elevation="0"
          @click="$refs.player.toggle()"
          :disabled="disabled"
          ><v-icon v-if="!playing">mdi-play</v-icon
          ><v-icon v-else>mdi-pause</v-icon></v-btn
        >
      </v-col>
      <v-col cols="9" sm="10" md="5">
        <waveform-player
          ref="player"
          v-model="playing"
          v-if="!disabled"
          :src="$apiURL(`/api/track/${track._id}/stream`)"
          :pcm="track.pcm"
          :track="this.track"
        ></waveform-player>
      </v-col>
      <v-col cols="12" md="1">
        <track-rating dense hover :track="track"></track-rating>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import WaveformPlayer from "@/components/WaveformPlayer.vue";
import TrackRating from "@/components/TrackRating.vue";

export default {
  components: {
    WaveformPlayer,
    TrackRating,
  },
  props: {
    tape: {
      type: Object,
    },
    track: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      playing: false,
    };
  },
};
</script>

<style></style>
