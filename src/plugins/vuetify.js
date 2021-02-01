import Vue from "vue";
import Vuetify from "vuetify/lib";
import en from "vuetify/es5/locale/en";
import de from "vuetify/es5/locale/de";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  lang: {
    current: "en",
    locales: {
      en,
      de,
    },
  },
});
