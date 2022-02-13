<template>
  <v-navigation-drawer
    fixed
    app
    :value="navigationDrawerOpen"
    @input="SET_NAVIGATION_DRAWER_OPEN($event)"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ $t("component.navigation_drawer.text_title") }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ $t("component.navigation_drawer.text_subtitle") }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item link :to="{ name: 'tape-list' }">
        <v-list-item-icon>
          <v-icon>mdi-magnify</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{
            $t("navigation.browse._name")
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link :to="{ name: 'login' }" v-if="!loggedIn">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t("navigation.login") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-weather-night</v-icon>
        </v-list-item-icon>
        <v-list-item-content class="nowrap">
          <v-switch
            :input-value="darkMode"
            dense
            hide-details
            inset
            @change="SET_DARK_MODE({ value: $event, vuetify: $vuetify })"
            class="mt-0 ml-2"
          ></v-switch>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["navigationDrawerOpen", "loggedIn", "darkMode"]),
  },
  methods: {
    ...mapMutations(["SET_NAVIGATION_DRAWER_OPEN", "SET_DARK_MODE"]),
  },
};
</script>

<style></style>
