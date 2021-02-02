<template>
  <v-snackbar v-model="show" color="error">{{
    $t("component.ajax_error.snackbar_text", { message: text })
  }}</v-snackbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  watch: {
    "$store.state.ajaxError": function () {
      this.show = true;
    },
  },
  computed: {
    ...mapState(["ajaxError"]),
    isServerError() {
      return (
        this.error &&
        this.ajaxError.response &&
        this.ajaxError.response.status >= 500
      );
    },
    is404() {
      return (
        this.ajaxError &&
        this.ajaxError.response &&
        this.ajaxError.response.status == 404
      );
    },
    isTimeout() {
      return this.ajaxError && !this.ajaxError.response;
    },
    text() {
      if (this.isServerError)
        return (
          this.$t(
            "component.ajax_error.ajax_error_snackbar.message_server_error"
          ) + ` (${this.ajaxError.response.status})`
        );
      if (this.is404)
        return (
          this.$t(
            "component.ajax_error.ajax_error_snackbar.message_not_found"
          ) + ` (${this.ajaxError.response.status})`
        );
      if (this.isTimeout)
        return this.$t(
          "component.ajax_error.ajax_error_snackbar.message_timeout"
        );
      else
        return this.$t(
          "component.ajax_error.ajax_error_snackbar.message_unknown_error"
        );
    },
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>

<style></style>
