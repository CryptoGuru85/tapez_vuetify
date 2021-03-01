<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <slot name="header">
          <tr>
            <th class="text-left">{{ $t("model.tape.cover") }}</th>
            <th class="text-left">{{ $t("model.tape.title") }}</th>
            <th class="text-left">{{ counterText }}</th>
          </tr>
        </slot>
      </thead>
      <tbody>
        <tr v-for="item in filtered" :key="item.id">
          <td class="td-cover">
            <slot name="cover" v-bind:item="item">
              <tape-cover :tape="item.document"></tape-cover>
            </slot>
          </td>
          <td class="td-title">{{ item.document.title }}</td>
          <td class="td-count">{{ item.count }}</td>
        </tr>
        <tr v-if="!filtered.length">
          <td colspan="3" class="text-center">
            {{ $t("component.document_toplist.no_data_available") }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import TapeCover from "@/components/TapeCover.vue";

export default {
  components: {
    TapeCover,
  },
  props: {
    statistics: {
      type: Object,
      default: () => {},
    },
    itemFilter: {
      type: Function,
      default: (item) => item,
    },
    countFilter: {
      type: Function,
      default: (entry) => entry,
    },
    max: {
      type: Number,
      default: 5,
    },
    counterText: {
      type: String,
      default() {
        return this.$tc("model.statistics_entry.type.view", 2);
      },
    },
  },
  computed: {
    filtered() {
      return Object.entries(this.statistics.byDocument)
        .map(([key, value]) => ({
          id: key,
          document: value.length ? value[0].for : undefined,
          count: value.filter(this.countFilter).length,
        }))
        .filter(this.itemFilter)
        .sort((a, b) => b.count - a.count)
        .slice(0, this.max - 1);
    },
  },
};
</script>

<style scoped>
.tape-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.td-cover {
  width: 10%;
}
.td-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 80%;
  max-width: 0;
}
.td-count {
  width: 10%;
}
</style>
