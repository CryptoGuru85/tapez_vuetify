<template>
  <v-card v-bind="$attrs">
    <v-card-title>
      <span class="display-1 mr-1 ml-3"
        ><v-icon class="mr-1" v-if="icon">{{ icon }}</v-icon
        >{{ sum }}</span
      >
      <span>{{ text }}</span>
    </v-card-title>
    <v-sparkline
      :show-labels="false"
      :value="values"
      smooth
      height="50"
      color="rgba(255, 255, 255, .7)"
      :gradient="['rgba(255, 255, 255, .7)', 'rgba(255, 255, 255, 0)']"
      padding="0"
      fill
      auto-draw
    ></v-sparkline>
  </v-card>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    lineColor: {
      type: String,
      default: "white",
    },
    statistics: {
      type: Object,
    },
    data: {
      type: Array,
    },
    filter: {
      type: Function,
      default: (entry) => entry,
    },
    icon: {
      type: String,
      default: "",
    },
  },
  computed: {
    values() {
      return Object.values(this.statistics.byDate).map(
        (entries) => entries.filter(this.filter).length
      );
    },
    sum() {
      return this.values.reduce((prev, curr) => prev + curr, 0);
    },
  },
};
</script>

<style></style>
