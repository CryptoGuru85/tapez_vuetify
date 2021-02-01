import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import Axios from "axios";
import i18n from "./i18n";
import { subject } from "@casl/ability";
import { abilitiesPlugin } from "@casl/vue";
import "vue-croppa/dist/vue-croppa.css";
import Croppa from "vue-croppa";
import apiURL from "@/util/apiURL";
import VueHead from "vue-head";

Vue.config.productionTip = false;

Axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
if (store.state.jwtToken)
  Axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${store.state.jwtToken}`;

Vue.prototype.$http = Axios;
Vue.prototype.$an = subject;
Vue.prototype.$apiURL = apiURL;

Vue.use(abilitiesPlugin, store.getters.ability);
Vue.use(VueHead);
Vue.use(Croppa);
new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
