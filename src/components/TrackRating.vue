<template>
  <v-rating
    v-bind="$attrs"
    :readonly="!$can('vote', 'Track')"
    :value="rating"
    @input="postRating"
  ></v-rating>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    rating() {
      return this.receivedRating || this.track.rating || 0;
    },
  },
  data: function () {
    return {
      receivedRating: 0,
    };
  },
  methods: {
    postRating(rating) {
      this.$http
        .post(`/api/track/${this.track._id}/rate`, {
          rate: rating,
        })
        .then((result) => (this.receivedRating = result.data.rating))
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
        });
    },
  },
};
</script>

<style></style>
