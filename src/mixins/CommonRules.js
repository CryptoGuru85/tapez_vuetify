import i18n from "../i18n";

//thanks to emailregex.com for this monstrosity
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  data() {
    return {
      commonRules: {
        required: (value) => !!value || i18n.t("validation_rules.required"),
        password: [
          //test for required
          (value) => !!value || i18n.t("validation_rules.required"),
          //test for length
          (value) =>
            value.length >= 8 || i18n.t("validation_rules.password_min_chars"),
          //test for uppercase letter
          (value) =>
            /[A-Z]/g.test(value) ||
            i18n.t("validation_rules.password_min_1_upper"),
          //test for digit
          (value) =>
            /[0-9]/g.test(value) ||
            i18n.t("validation_rules.password_min_1_digit"),
          //test for special char
          (value) =>
            /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/g.test(value) ||
            i18n.t("validation_rules.password_min_1_special"),
        ],
        passwordMatch: (other) => (value) =>
          value === other || i18n.t("validation_rules.passwords_dont_match"),
        min: (min) => (value) => {
          value >= min;
        },
        max: (max) => (value) => {
          value <= max;
        },
        minChars: (min) => (value) =>
          (value && value.length >= min) ||
          i18n.t("validation_rules.min_x_chars", { min }),
        maxChars: (max) => (value) =>
          (value && value.length <= max) ||
          i18n.t("validation_rules.max_x_chars", { max }),
        year: (value) =>
          (!Number.isNaN(value) &&
            1900 <= value &&
            value <= new Date().getFullYear()) ||
          i18n.t("validation_rules.valid_year", {
            year: new Date().getFullYear(),
          }),
        minFiles: (min) => (value) =>
          value.length >= min || i18n.t("validation_rules.min_x_files", [min]),
        maxFiles: (max) => (value) =>
          value.length <= max ||
          i18n.t("validation_rules.max_x_files", { max }),
        alphaNumeric: (value) =>
          !!value.match(/^[a-z0-9]+$/i) ||
          i18n.t("validation_rules.alphanumeric"),
        email: (value) =>
          emailRegex.test(value) || i18n.t("validation_rules.email"),
      },
    };
  },
};
