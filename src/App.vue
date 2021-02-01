<template>
  <v-app>
    <navigation-drawer v-if="$vuetify.breakpoint.mobile"></navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mobile"
        @click="OPEN_NAVIGATION_DRAWER()"
      ></v-app-bar-nav-icon>
      <v-img
        class="d-none d-sm-inline mr-3"
        :src="logo"
        max-height="40px"
        max-width="40px"
        aspect-ratio="1"
      ></v-img>
      <v-toolbar-title class="headline text-uppercase mr-1" link to="home">
        <router-link :to="{ name: 'home' }" class="brand">
          {{ $t("app.name") }}
        </router-link>
      </v-toolbar-title>

      <span class="d-none d-sm-inline font-weight-light slogan">{{
        $t("app.slogan")
      }}</span>
      <span v-if="!$vuetify.breakpoint.mobile">
        <router-link :to="{ name: 'tape-list' }" class="ml-5">{{
          $t("navigation.browse._name")
        }}</router-link>
      </span>
      <v-spacer></v-spacer>
      <v-btn
        text
        v-if="!loggedIn && !$vuetify.breakpoint.mobile"
        :to="{
          name: 'login',
          query: { redirect: $router.currentRoute.fullPath },
        }"
        class="mr-2"
      >
        {{ $t("navigation.login") }}
      </v-btn>
      <i18n-selection-dropdown
        v-if="!loggedIn"
        class="d-none d-sm-inline"
      ></i18n-selection-dropdown>
      <user-avatar
        v-if="loggedIn && $vuetify.breakpoint.mobile"
        :user="user"
        @click="OPEN_USER_DRAWER()"
        class="user-avatar"
      ></user-avatar>
    </v-app-bar>
    <user-drawer v-if="loggedIn"></user-drawer>
    <v-main>
      <router-view :key="$route.path"></router-view>
    </v-main>
    <v-footer>
      <v-col class="text-center" cols="12">{{
        $t("app.copyright", { year: new Date().getFullYear() })
      }}</v-col>
    </v-footer>
    <ajax-error :error="$store.state.ajaxError"></ajax-error>
  </v-app>
</template>

<script>
import I18nSelectionDropdown from "@/components/I18nSelectionDropdown.vue";
import UserDrawer from "@/components/UserDrawer.vue";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import AjaxError from "@/components/AjaxError.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import Logo from "@/assets/logo.svg";

import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import { defineAnonymousRules } from "./roles/roles";

export default {
  name: "App",
  components: {
    I18nSelectionDropdown,
    UserDrawer,
    AjaxError,
    UserAvatar,
    NavigationDrawer,
  },
  data: () => ({
    logo: Logo,
  }),
  async created() {
    if (!this.loggedIn) {
      this.ability.update(defineAnonymousRules());
    }
    this.changeLocale({ locale: this.locale, vuetify: this.$vuetify });
    this.SET_DARK_MODE({ value: this.darkMode, vuetify: this.$vuetify });
  },
  computed: {
    ...mapState(["loggedIn", "user", "locale", "darkMode"]),
    ...mapGetters(["ability"]),
  },
  methods: {
    ...mapMutations([
      "OPEN_USER_DRAWER",
      "OPEN_NAVIGATION_DRAWER",
      "SET_DARK_MODE",
    ]),
    ...mapActions(["changeLocale"]),
  },
};
</script>
<style scoped>
.user-avatar {
  cursor: pointer;
}
.slogan {
  line-height: 1;
  font-size: 0.8rem;
  text-transform: uppercase;
  max-width: 80px;
}
.brand {
  text-decoration: none;
  color: inherit;
  font-size: 1.8rem;
}
</style>
