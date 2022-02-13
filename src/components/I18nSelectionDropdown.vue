<template>
  <div class="i18n-selector">
    <v-select
      :items="langs"
      :value="locale"
      class="mt-4"
      dense
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @input="changeLocale({ locale: $event, vuetify: $vuetify })"
    >
      <template slot="item" slot-scope="data">
        <v-img
          :src="require(`@/assets/flags/${data.item}.svg`)"
          max-width="20px"
          contain
        ></v-img>
      </template>
      <template slot="selection" slot-scope="data">
        <v-img
          :src="require(`@/assets/flags/${data.item}.svg`)"
          max-width="20px"
          contain
        ></v-img>
      </template>
    </v-select>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "I18nSelectionDropdown",
  data() {
    return { langs: ["de", "en"] };
  },
  methods: {
    ...mapActions(["changeLocale"]),
  },
  computed: {
    ...mapState(["locale"]),
  },
};
</script>

<style scoped>
.i18n-selector {
  width: 50px;
}
</style>
