<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        :label="$tc('model.user.username', 1) + '*'"
        :value="value.username"
        :rules="[commonRules.required]"
        prepend-inner-icon="mdi-account"
        outlined
        @input="$emit('input', { ...value, username: $event })"
        @keydown.enter="$emit('submit')"
      ></v-text-field>
      <v-text-field
        :label="$tc('model.user.password', 1) + '*'"
        :value="value.password"
        :rules="[commonRules.required]"
        outlined
        prepend-inner-icon="mdi-key-variant"
        :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
        :type="show ? 'text' : 'password'"
        @click:append="show = !show"
        @input="$emit('input', { ...value, password: $event })"
        @keydown.enter="$emit('submit')"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import commonRules from "../mixins/CommonRules";

export default {
  props: ["value", "errors"],
  mixins: [commonRules],
  data() {
    return {
      show: false,
    };
  },
  methods: {
    dbg() {
      console.log("dbg");
    },
  },
};
</script>

<style></style>
