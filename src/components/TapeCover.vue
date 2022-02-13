<template>
  <v-responsive :aspect-ratio="1" v-bind="$attrs">
    <v-img
      :src="src"
      :aspect-ratio="1"
      @error="error = true"
      v-if="!error"
    ></v-img>
    <div v-else class="d-flex align-center justify-center no-image">
      <div class="d-align-center d-justify-center no-image-text">
        {{ $t("component.tape_cover.text_no_image") }}
      </div>
    </div>
  </v-responsive>
</template>

<script>
export default {
  props: {
    tape: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      error: false,
    };
  },
  computed: {
    src() {
      return this.$apiURL(`/data/covers/${this.tape.cover}`);
    },
  },
};
</script>
<style scoped>
.no-image {
  width: 100%;
  height: 100%;
  background-color: lightgray;
}
.no-image-text {
  color: grey;
  font-size: 1vw;
}
</style>
