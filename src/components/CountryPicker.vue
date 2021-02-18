<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="countryCodes"
    :value="value"
    @input="$emit('input', $event)"
    item-text="name"
    item-value="code"
  ></v-autocomplete>
</template>

<script>
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import de from "i18n-iso-countries/langs/de.json";

export default {
  props: ["value"],
  computed: {
    countryCodes() {
      const names = countries.getNames(this.$i18n.locale);
      const ret = [
        ...Object.keys(names).map((k) => ({
          code: k,
          name: names[k],
        })),
      ];
      return ret;
    },
  },
  created() {
    countries.registerLocale(en);
    countries.registerLocale(de);
  },
};
</script>

<style></style>
