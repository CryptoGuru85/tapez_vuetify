<template>
  <div>
    <v-timeline reverse v-bind="$attrs" v-if="tapes && tapes.length">
      <v-timeline-item v-for="tape in tapes" :key="tape._id">
        <template v-slot:opposite>
          <span :class="`display-1`">{{ tape.year }}</span>
        </template>
        <tape-card :tape="tape"></tape-card>
      </v-timeline-item>
    </v-timeline>
    <p class="mt-5 text-center" v-else>
      {{ $t("component.tape_timeline.message_no_tapes") }}
    </p>
  </div>
</template>

<script>
import TapeCard from "@/components/TapeCard.vue";
export default {
  components: {
    TapeCard,
  },
  props: {
    tapes: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style></style>
