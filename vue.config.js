module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: "source-map",
  },
  chainWebpack: (config) => {
    config.externals({ moment: "moment" });
  },
  pluginOptions: {
    i18n: {
      locale: "de",
      fallbackLocale: "de",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
};
