<template>
  <v-row form dense>
    <v-col cols="12">
      <v-text-field
        :label="$tc('model.user.username', 1) + '*'"
        :value="value.username"
        :rules="[
          commonRules.required,
          commonRules.minChars(4),
          commonRules.alphaNumeric,
        ]"
        :error-messages="usernameErrors"
        :error="!usernameAvailable"
        :success="usernameAvailabilityLoaded && usernameAvailable"
        :hint="$t('form.register.hint_username')"
        persistent-hint
        prepend-inner-icon="mdi-account"
        outlined
        @keyup="checkUsernameAvailability"
        @input="$emit('input', { ...value, username: $event })"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        :label="$tc('model.user.email', 1) + '*'"
        :value="value.email"
        :rules="[commonRules.required, commonRules.email]"
        :error-messages="emailErrors"
        :error="!emailAvailable"
        :success="emailAvailabilityLoaded && emailAvailable"
        :hint="$t('form.register.hint_email')"
        persistent-hint
        prepend-inner-icon="mdi-email"
        @keyup="checkEmailAvailability"
        type="email"
        outlined
        @input="$emit('input', { ...value, email: $event })"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6">
      <v-text-field
        :label="$tc('model.user.firstname', 1) + '*'"
        :value="value.firstname"
        :rules="[commonRules.required]"
        :error-messages="errors.firstname"
        outlined
        @input="$emit('input', { ...value, firstname: $event })"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6">
      <v-text-field
        :label="$tc('model.user.lastname', 1) + '*'"
        :value="value.lastname"
        :rules="[commonRules.required]"
        :error-messages="errors.lastname"
        outlined
        @input="$emit('input', { ...value, lastname: $event })"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        :label="$tc('model.user.password', 1) + '*'"
        :rules="commonRules.password"
        :success="validPassword"
        :type="showPass ? 'text' : 'password'"
        :hint="$t('form.register.hint_password')"
        v-model="password"
        persistent-hint
        :error-messages="errors.password"
        :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="showPass = !showPass"
        prepend-inner-icon="mdi-key-variant"
        outlined
        @input="$emit('input', { ...value, password: $event })"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        :label="$t('form.register.label_repeat_password') + '*'"
        :value="value.passwordRepeat"
        prepend-inner-icon="mdi-repeat"
        outlined
        v-model="passwordRepeat"
        :success="passwordsMatch"
        :type="showPass ? 'text' : 'password'"
        v-if="!showPass"
        :rules="[
          commonRules.required,
          commonRules.passwordMatch(value.password),
        ]"
        @input="$emit('input', { ...value, passwordRepeat: $event })"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import commonRules from "../mixins/CommonRules";

export default {
  props: {
    value: {
      type: Object,
    },
    errors: {
      type: Object,
    },
  },
  data() {
    return {
      showPass: false,
      usernameAvailabilityLoaded: false,
      usernameAvailable: true,
      emailAvailabilityLoaded: false,
      emailAvailable: true,
      password: "",
      passwordRepeat: "",
    };
  },
  mixins: [commonRules],
  computed: {
    usernameErrors() {
      const error = this.usernameAvailable
        ? null
        : this.$t("form.register.error_username_exists");
      if (this.errors.username) return this.errors.username.concat(error);
      else return error;
    },
    emailErrors() {
      const error = this.emailAvailable
        ? null
        : this.$t("form.register.error_email_exists");
      if (this.errors.email) return this.errors.email.concat(error);
      else return error;
    },
    validPassword() {
      let valid = true;
      this.commonRules.password.forEach(
        (rule) => (valid = valid && rule(this.password) === true)
      );
      return valid;
    },
    passwordsMatch() {
      return (
        this.passwordRepeat.length > 0 && this.password == this.passwordRepeat
      );
    },
  },
  methods: {
    checkUsernameAvailability() {
      this.usernameAvailabilityLoaded = false;
      this.$http
        .post("/api/user/exists", {
          username: this.value.username,
        })
        .then((response) => {
          this.usernameAvailable = !response.data;
          this.usernameAvailabilityLoaded = true;
        });
    },
    checkEmailAvailability() {
      this.emailAvailabilityLoaded = false;
      if (!this.value.email) return;
      this.$http
        .post("/api/user/exists", {
          email: this.value.email,
        })
        .then((response) => {
          this.emailAvailable = !response.data;
          this.emailAvailabilityLoaded = true;
        });
    },
  },
};
</script>

<style></style>
