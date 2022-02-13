<template>
  <v-rating
    :readonly="!$can('vote', 'Tape') || readonly"
    :value="rating"
    @input="postRating"
    v-bind="$attrs"
  ></v-rating>
</template>

<script>
export default {
  props: {
    tape: {
      type: Object,
      default: () => {},
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rating() {
      return this.receivedRating || this.tape.rating || 0;
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
        .post(`/api/tape/${this.tape._id}/rate`, {
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
