<template>
  <v-hover v-model="hover">
    <v-navigation-drawer
      class="user-drawer"
      right
      fixed
      app
      :value="userDrawerOpen"
      :mini-variant="isMini"
      mini-variant-width="70"
      @input="SET_USER_DRAWER_OPEN($event)"
    >
      <v-list dense nav class="py-0">
        <alias-picker @open="miniVariant = false" @close="miniVariant = true">
          <template v-slot:activator="{ on }">
            <v-list-item two-line link v-on="on" class="px-0">
              <user-avatar :user="alias" class="mx-2"></user-avatar>
              <v-list-item-content class="nowrap">
                <v-list-item-title class="title">{{
                  alias.displayName
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="alias.username">{{
                    $t("model.user._name")
                  }}</span>
                  <span v-else>{{ $t("model.artist._name") }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-menu-down</v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </alias-picker>
        <v-divider class="mb-1"></v-divider>
        <v-list-item link :to="{ name: 'tape-upload' }" class="px-0">
          <v-list-item-avatar>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="nowrap">{{
            $t("component.user_drawer.action_submit_tape")
          }}</v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'user-info' }" class="px-0">
          <v-list-item-avatar>
            <v-icon>mdi-account</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="nowrap">{{
            $t("component.user_drawer.label_user_info")
          }}</v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'user-tapes' }" class="px-0">
          <v-list-item-avatar>
            <v-icon>mdi-cassette</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="nowrap">{{
            $t("component.user_drawer.label_user_tapes")
          }}</v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          :to="{ name: 'acp' }"
          class="px-0"
          v-if="$can('view', 'acp')"
        >
          <v-list-item-avatar>
            <v-icon>mdi-brain</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="nowrap">{{
            $t("component.user_drawer.label_acp")
          }}</v-list-item-content>
        </v-list-item>
        <v-divider class="mb-1"></v-divider>
        <v-list-item
          v-for="artist in user.artists"
          :key="artist._id"
          link
          :to="{ name: 'artist-profile', params: { id: artist._id } }"
        >
          <v-list-item-avatar height="40px">
            <user-avatar height="40px" :user="artist"></user-avatar>
          </v-list-item-avatar>
          <v-list-item-content class="nowrap">{{
            artist.displayName
          }}</v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="user.artists.length < 10"
          link
          :to="{
            name: 'artist-profile-creation',
            query: { redirect: $router.currentRoute.fullPath },
          }"
        >
          <v-list-item-avatar><v-icon>mdi-plus</v-icon></v-list-item-avatar>
          <v-list-item-content class="nowrap">{{
            $t("component.user_drawer.action_new_artist")
          }}</v-list-item-content>
        </v-list-item>
        <v-divider class="mb-1"></v-divider>
        <v-list-item link @click="logout">
          <v-list-item-avatar>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="nowrap">{{
            $t("component.user_drawer.action_logout")
          }}</v-list-item-content>
        </v-list-item>
        <v-list-item dense>
          <v-list-item-avatar>
            <v-icon>mdi-earth</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="nowrap">
            <i18n-selection-dropdown
              @focus="miniVariant = false"
              @blur="miniVariant = true"
            ></i18n-selection-dropdown>
          </v-list-item-content>
        </v-list-item>
        <v-list-item dense>
          <v-list-item-avatar>
            <v-icon>mdi-weather-night</v-icon>
          </v-list-item-avatar>
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
  </v-hover>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import UserAvatar from "./UserAvatar.vue";
import AliasPicker from "./AliasPicker.vue";
import I18nSelectionDropdown from "./I18nSelectionDropdown.vue";

export default {
  components: {
    UserAvatar,
    AliasPicker,
    I18nSelectionDropdown,
  },
  computed: {
    ...mapState(["user", "userDrawerOpen", "LoggedIn", "darkMode"]),
    ...mapGetters(["availableAliases", "alias"]),
    isMini() {
      return (
        !this.hover && this.miniVariant && !this.$vuetify.breakpoint.mobile
      );
    },
  },
  methods: {
    ...mapMutations(["SET_USER_DRAWER_OPEN", "SET_DARK_MODE"]),
    ...mapActions(["logout"]),
  },
  mounted() {
    this.SET_USER_DRAWER_OPEN(!this.$vuetify.breakpoint.mobile);
  },
  data() {
    return {
      miniVariant: true,
      hover: false,
    };
  },
};
</script>

<style scoped>
.user-drawer {
  z-index: 10;
}
.drawer-close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
.nowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 100%;
  width: 100%;
}
</style>
