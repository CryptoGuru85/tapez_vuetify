<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-text-field
        v-model="genre.name"
        :label="$tc('model.genre._name', 1) + '*'"
        :rules="[
          commonRules.minChars(2),
          commonRules.maxChars(100),
          commonRules.required,
        ]"
      >
      </v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        type="number"
        :label="$t('model.genre.id3_id')"
        v-model="genre.id3_id"
      >
      </v-text-field>
    </v-col>
    <v-col cols="12">
      <v-color-picker v-model="genre.color"> </v-color-picker>
    </v-col>
  </v-row>
</template>

<script>
import commonRules from "../mixins/CommonRules";

export default {
  props: ["value", "errors", "tape"],
  mixins: [commonRules],
  data: function () {
    return {
      genre: this.value,
    };
  },
  watch: {
    value() {
      this.genre = this.value;
      this.color = this.value.color;
    },
    genre() {
      this.$emit("input", this.genre);
    },
    color() {
      this.genre.color = this.color["hex"];
      this.$emit("input", this.genre);
    },
  },
};
</script>

<style></style>
