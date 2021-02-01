<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4" xl="3">
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
          <v-card-title class="justify-center">
            <div>
              <span>{{ $t("view.login.title_login") }}</span>
            </div>
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center">{{
            $t("view.login.subtitle_login")
          }}</v-card-subtitle>
          <v-card-text>
            <v-form
              v-model="valid"
              :disabled="loading"
              :errors="validationErrors"
            >
              <login-form v-model="user" @submit="login"></login-form>
            </v-form>
            <v-alert type="error" v-if="loginFailed">{{
              $t("view.login.message_login_failed", { reason: loginFailReason })
            }}</v-alert>
            <div class="mb-2">
              <router-link to="/home">{{
                $t("view.login.action_password_reset")
              }}</router-link>
            </div>
            <div>
              <router-link to="/home">{{
                $t("view.login.action_upgrade_legacy_account")
              }}</router-link>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" :to="{ name: 'register' }">{{
              $t("view.login.action_register")
            }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              depressed
              large
              @click="login"
              :disabled="!valid"
              >{{ $t("view.login.action_login") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from "@/forms/Login.vue";

export default {
  components: {
    LoginForm,
  },
  head: {
    title() {
      return {
        inner: this.$t("view.login.title"),
      };
    },
  },
  methods: {
    dbg() {
      console.log("fire");
    },
    login() {
      this.loading = false;
      this.$store
        .dispatch("login", this.user)
        .then(() => {
          this.$ability.update(this.$store.state.rules);
          if (this.$route.query.redirect)
            this.$router.push(this.$route.query.redirect);
          else this.$router.push({ name: "home" });
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status == 400)
              this.validationErrors = err.response.data;
            else {
              this.loginFailed = true;
              if (err.response.status == 403)
                this.loginFailReason = this.$t(
                  "view.login.message_fail_reason_banned"
                );
              else if (err.response.status == 401)
                this.loginFailReason = this.$t(
                  "view.login.message_fail_reason_unauthorized"
                );
            }
          }
        })
        .then(() => {
          this.loading = false;
        });
    },
  },
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      logo: require("@/assets/logo.svg"),
      valid: false,
      loading: false,
      validationErrors: {},
      loginFailed: false,
      loginFailReason: this.$t("view.login.message_fail_unknown"),
    };
  },
};
</script>

<style></style>
