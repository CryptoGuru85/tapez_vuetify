<template>
  <v-chip
    :color="internalGenre && internalGenre.color ? internalGenre.color : 'gray'"
    :to="browseLink"
    v-bind="$attrs"
    >{{
      internalGenre && internalGenre.color
        ? internalGenre.name
        : $t("component.genre_chip.unknown_genre")
    }}</v-chip
  >
</template>

<script>
export default {
  props: {
    genre: {
      default() {
        return {
          color: "gray",
          name: this.$t("component.genre_chip.unknown_genre"),
        };
      },
    },
    link: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      internalGenre: {
        color: "gray",
        name: this.$t("component.genre_chip.unknown_genre"),
      },
    };
  },
  watch: {
    genre(newVal) {
      if (this.genre._id) {
        this.internalGenre = newVal;
      } else {
        this.loadGenre(this.genre);
      }
    },
  },
  methods: {
    loadGenre(id) {
      this.$http(`/api/genre/${id}`)
        .then((data) => data.data)
        .then((genre) => {
          this.internalGenre = genre;
        })
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
        });
    },
  },
  computed: {
    browseLink() {
      return this.link
        ? {
            name: "tape-list",
            query: {
              genres: this.internalGenre._id,
            },
          }
        : undefined;
    },
  },
  created() {
    if (this.genre._id) {
      this.internalGenre = this.genre;
    } else {
      this.loadGenre(this.genre._id || this.genre);
    }
  },
};
</script>

<style></style>
