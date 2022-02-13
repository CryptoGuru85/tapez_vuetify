<template>
  <v-row>
    <v-col v-for="tape in loadedTapes" :key="tape.title" lg="2" md="4" cols="6">
      <tape-card :tape="tape"></tape-card>
    </v-col>
  </v-row>
</template>

<script>
import TapeCard from "@/components/TapeCard.vue";

export default {
  components: {
    TapeCard,
  },

  props: {
    title: {
      type: String,
      default: "",
    },
    src: {
      type: String,
      default: null,
    },
    tapes: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      loadedTapes: [{}, {}, {}, {}, {}, {}],
      loadingError: false,
    };
  },

  watch: {
    src(newVal) {
      this.$http
        .get(newVal)
        .then((data) => (this.loadedTapes = data.data))
        .catch((err) => {
          this.loadingError = true;
          this.$store.dispatch("ajaxError", err);
        });
    },
    tapes(newVal) {
      this.loadedTapes = newVal;
    },
  },

  mounted() {
    if (this.src) {
      this.$http
        .get(this.src)
        .then(
          (data) =>
            (this.loadedTapes = data.data.docs ? data.data.docs : data.data)
        )
        .catch(() => {
          this.loadingError = true;
        });
    } else if (this.tapes != []) {
      this.loadedTapes = this.tapes;
    }
  },
};
</script>

<style></style>
