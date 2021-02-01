module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "prettier",
    "plugin:@intlify/vue-i18n/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "@intlify/vue-i18n/key-format-style": ["error", "snake_case"],
    "@intlify/vue-i18n/no-duplicate-keys-in-locale": ["error"],
    "@intlify/vue-i18n/no-unused-keys": [
      "error",
      {
        extensions: [".js", ".vue"],
      },
    ],
    "@intlify/vue-i18n/no-raw-text": [
      "warning",
      {
        ignoreNodes: ["v-icon"],
        ignorePattern: "^[-#:()&•,/%]+$",
      },
    ],
  },
  settings: {
    "vue-i18n": {
      localeDir: "./src/locales/*.json",
    },
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
