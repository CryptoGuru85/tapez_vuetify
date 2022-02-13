<template>
  <div>
    <v-card
      v-if="tape._id"
      :to="{ name: 'tape-detail', params: { id: tape.alias } }"
    >
      <tape-cover :tape="tape"></tape-cover>
      <v-card-title
        ><div class="tape-title">{{ tape.title }}</div></v-card-title
      >
      <v-card-subtitle class="pb-0">{{ tape.artist.name }}</v-card-subtitle>
      <v-card-actions class="pt-0 px-3">
        <v-rating small dense readonly :value="tape.rating"></v-rating>
      </v-card-actions>
    </v-card>
    <v-skeleton-loader
      v-else
      class="mx-auto"
      max-width="300"
      type="card"
    ></v-skeleton-loader>
  </div>
</template>

<script>
import TapeCover from "@/components/TapeCover.vue";
export default {
  components: {
    TapeCover,
  },
  props: {
    tape: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.tape-title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
