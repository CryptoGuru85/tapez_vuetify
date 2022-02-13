<template>
  <v-row no-gutters>
    <v-col cols="12" md="8">
      <v-carousel cycle height="576px" v-model="current">
        <v-carousel-item
          v-for="tape in tapes"
          :key="tape.title"
          :src="$apiURL(`/data/covers/${tape.cover}`)"
          :to="{ name: 'tape-detail', params: { id: tape.alias } }"
        >
          <v-container fill-height fluid>
            <v-row class="fill-height pb-5" align-content="end">
              <v-col cols="12" class="lightbox">
                <div class="text-h3">{{ tape.title }}</div>
                <div class="text-h4">{{ tape.artist.name }}</div>
              </v-col>
            </v-row>
          </v-container>
        </v-carousel-item>
      </v-carousel>
    </v-col>
    <v-col cols="12" md="4" class="d-none d-md-block">
      <v-list class="py-0">
        <v-list-item-group v-model="current">
          <v-list-item
            class="my-0"
            two-line
            v-for="tape in tapes"
            :key="tape._id"
          >
            <v-list-item-avatar size="64" tile>
              <tape-cover :tape="tape"></tape-cover>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-h6 text-truncate">{{
                tape.title
              }}</v-list-item-title>
              <v-list-item-subtitle>{{
                tape.artist.name
              }}</v-list-item-subtitle>
            </v-list-item-content></v-list-item
          >
        </v-list-item-group>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
import TapeCover from "./TapeCover.vue";
export default {
  components: { TapeCover },

  props: {
    tapes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      current: 0,
    };
  },
};
</script>

<style scoped>
.lightbox {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 72px
  );
  margin-bottom: 18px;
  text-shadow: 0 0 20px black;
}
</style>
