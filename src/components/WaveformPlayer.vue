<template>
  <div :id="id"></div>
</template>

<script>
import WaveSurfer from "wavesurfer";

export default {
  props: {
    src: {
      type: String,
    },
    id: {
      type: String,
      default: () => "a" + Math.random().toString(36).substring(7),
    },
    height: {
      type: Number,
      default: 40,
    },
    value: {
      type: Boolean,
      default: false,
    },
    pcm: {
      type: Object,
      default: () => {},
    },
    track: {
      type: Object,
    },
  },
  data: function () {
    return {
      waveForm: {},
      playSent: false,
    };
  },
  methods: {
    toggle() {
      this.waveForm.playPause();
    },
  },
  watch: {
    "$store.state.runningPlayerId": function (newVal) {
      if (newVal != this.id) this.waveForm.pause();
    },
  },
  mounted() {
    this.waveForm = WaveSurfer.create({
      container: "#" + this.id,
      height: this.height,
      barWidth: 3,
      barGap: 1,
      backend: "MediaElement",
    });
    this.waveForm.on("play", () => {
      this.$emit("input", true);
      this.$store.commit("SET_RUNNING_PLAYER_ID", this.id);
      if (!this.playSent && this.track) {
        this.$http.post(this.$apiURL(`/api/track/${this.track._id}/play`));
        this.playSent = true;
      }
    });
    this.waveForm.on("pause", () => {
      this.$emit("input", false);
    });
    this.waveForm.load(this.src, this.pcm ? this.pcm.data : null, "none");
  },
};
</script>

<style></style>
