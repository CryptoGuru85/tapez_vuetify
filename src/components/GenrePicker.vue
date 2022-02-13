<template>
  <v-autocomplete
    item-value="_id"
    item-text="name"
    v-bind="$attrs"
    :disabled="!this.loaded || this.error"
    :loading="!this.loaded"
    :items="this.genres"
    :value="value"
    @input="$emit('input', $event)"
  >
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-chip :color="data.item.color">{{ data.item.name }}</v-chip>
        </v-list-item-content>
      </template>
    </template>
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        :close="$attrs.multiple"
        @click="data.select"
        @click:close="remove(data.item)"
        small
        :color="data.item.color"
        >{{ data.item.name }}</v-chip
      >
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: ["value"],

  data() {
    return {
      genres: [],
      loaded: false,
      error: false,
    };
  },
  methods: {
    remove(item) {
      this.$emit(
        "input",
        this.value.filter(item._id ? (p) => p != item._id : (p) => p != item)
      );
    },
  },
  created() {
    this.$http
      .get("/api/genre")
      .then((response) => response.data)
      .then((data) => {
        this.genres = data;
      })
      .then(() => (this.loaded = true))
      .catch(() => (this.error = true));
  },
};
</script>

<style></style>
