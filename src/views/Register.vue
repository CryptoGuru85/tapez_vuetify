<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4" xl="4">
        <v-card>
          <div class="d-flex pt-5 justify-center">
            <v-img
              :src="logo"
              :aspect-ratio="1"
              max-height="50px"
              min-height="50px"
              max-width="50px"
            ></v-img>
          </div>
          <v-card-title class="justify-center">{{
            $t("view.register.title")
          }}</v-card-title>
          <v-card-subtitle class="d-flex justify-center">{{
            $t("view.register.subtitle")
          }}</v-card-subtitle>
          <v-card-text>
            <v-form v-model="valid">
              <register-form
                v-model="user"
                :errors="validationErrors"
              ></register-form>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text>{{ $t("view.register.action_reset") }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              depressed
              large
              @click="signup"
              :disabled="!valid"
              :loading="loading"
            >
              {{ $t("view.register.action_register") }}</v-btn
            >
          </v-card-actions>
          <v-alert type="error" v-if="apiError">{{ apiError.message }}</v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { unpackRules } from "@casl/ability/extra";
import RegisterForm from "@/forms/Register.vue";

export default {
  components: {
    RegisterForm,
  },
  head: {
    title() {
      return {
        inner: this.$t("view.register.title"),
      };
    },
  },
  data() {
    return {
      valid: false,
      validationErrors: {},
      apiError: null,
      loading: false,
      logo: require("@/assets/logo.svg"),
      user: {
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        passwordRepeat: "",
      },
    };
  },
  methods: {
    signup() {
      this.loading = true;
      this.$http
        .post("/api/user/signup", this.user)
        .then((response) => response.data)
        .then((data) => {
          this.$store.commit("SET_JWT_TOKEN", data.accessToken);
          this.$store.commit("SET_LOGGED_IN", true);
          this.$store.commit("SET_USER", data.user);
          this.$store.commit("SET_RULES", unpackRules(data.rules));
        })
        .then(() => {
          if (this.$route.query.redirect)
            this.$router.push(this.$route.query.redirect);
          else this.$router.push({ name: "home" });
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status == 400)
              this.validationErrors = err.response.data;
            else this.apiError = err.response.data;
          } else this.apiError = { message: err.message };
        })
        .then(() => (this.loading = false));
    },
  },
};
</script>

<style></style>
