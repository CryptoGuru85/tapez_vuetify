import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import abilitesPlugin from "./ability";
import { Ability } from "@casl/ability";
import { unpackRules } from "@casl/ability/extra";
import createPersistedState from "vuex-persistedstate";
import i18n from "../i18n";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [abilitesPlugin, createPersistedState()],
  state: {
    jwtToken: "",
    loggedIn: false,
    user: {},
    userDrawerOpen: false,
    navigationDrawerOpen: false,
    rules: [],
    aliasId: null,
    runningPlayerId: null,
    genres: [],
    ajaxError: {},
    fetchError: {},
    locale: "en",
    darkMode: true,
  },
  mutations: {
    SET_JWT_TOKEN(state, value) {
      state.jwtToken = value;
      if (value) Axios.defaults.headers["Authorization"] = `Bearer ${value}`;
      else Axios.defaults.headers["Authorization"] = null;
    },
    SET_LOGGED_IN(state, value) {
      state.loggedIn = value;
    },
    SET_USER(state, value) {
      state.user = value;
    },
    SET_RULES(state, value) {
      state.rules = value;
    },
    OPEN_USER_DRAWER(state) {
      state.userDrawerOpen = true;
    },
    CLOSE_USER_DRAWER(state) {
      state.userDrawerOpen = false;
    },
    SET_USER_DRAWER_OPEN(state, value) {
      state.userDrawerOpen = value;
    },
    OPEN_NAVIGATION_DRAWER(state) {
      state.navigationDrawerOpen = true;
    },
    CLOSE_NAVIGATION_DRAWER(state) {
      state.navigationDrawerOpen = false;
    },
    SET_NAVIGATION_DRAWER_OPEN(state, value) {
      state.navigationDrawerOpen = value;
    },
    SET_ALIAS_ID(state, value) {
      if (value == state.user._id) state.aliasId = "";
      else state.aliasId = value;
    },
    SET_RUNNING_PLAYER_ID(state, value) {
      state.runningPlayerId = value;
    },
    SET_GENRES(state, value) {
      state.genres = value;
    },
    UPDATE_ARTIST(state, artist) {
      state.user.artists = state.user.artists.map((p) =>
        p._id == artist._id ? artist : p
      );
    },
    SET_AJAX_ERROR(state, error) {
      state.ajaxError = error;
    },
    SET_FETCH_ERROR(state, error) {
      state.fetchError = error;
    },
    SET_LOCALE(state, { locale, vuetify }) {
      state.locale = locale;
      vuetify.lang.current = locale;
      i18n.locale = locale;
    },
    SET_DARK_MODE(state, { value, vuetify }) {
      state.darkMode = value;
      vuetify.theme.dark = value;
    },
  },
  getters: {
    ability(state) {
      return new Ability(state.rules, {
        subjectName: (resource) =>
          resource && typeof resource === "object" ? resource._type : resource,
      });
    },
    availableAliases(state) {
      return [state.user, ...state.user.artists];
    },
    alias(state) {
      if (!state.aliasId || state.aliasId == state.user._id) {
        return {
          ...state.user,
          type: "user",
        };
      }
      const artist = state.user.artists.find((p) => p._id == state.aliasId);
      return {
        ...artist,
        type: "artist",
      };
    },
    userHasArtistProfiles(state) {
      return state.user.artists && state.user.artists.length > 0;
    },
  },
  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        Axios.post("/api/user/login", payload).then(
          (response) => {
            commit("SET_JWT_TOKEN", response.data.accessToken);
            commit("SET_LOGGED_IN", true);
            commit("SET_USER", response.data.user);
            commit("SET_RULES", unpackRules(response.data.rules));
            resolve();
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    logout({ commit }) {
      commit("SET_JWT_TOKEN", "");
      commit("SET_LOGGED_IN", false);
      commit("SET_USER", {});
      commit("SET_RULES", undefined);
      commit("CLOSE_USER_DRAWER");
      router.push({ name: "home" });
    },
    ajaxError({ commit }, error) {
      //form validation errors must be handled manually
      if (!(error && error.response && error.response.status == 400))
        commit("SET_AJAX_ERROR", error);
    },
    fetchError({ commit }, error) {
      //form validation errors must be handled manually
      commit("SET_FETCH_ERROR", error);
    },
    changeLocale({ commit }, locale) {
      commit("SET_LOCALE", locale);
    },
  },
  modules: {},
});
