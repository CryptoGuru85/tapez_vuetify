<template>
  <div>
    <server-error v-if="isServerError" :error="error"></server-error>
    <not-found v-else-if="is404"></not-found>
    <timeout-error v-else></timeout-error>
  </div>
</template>

<script>
import ServerError from "@/views/ServerError.vue";
import NotFound from "@/views/404.vue";
import TimeoutError from "@/views/TimeoutError.vue";

export default {
  components: {
    ServerError,
    NotFound,
    TimeoutError,
  },
  props: {
    error: {
      type: Error,
      default: () => {},
    },
  },
  computed: {
    isServerError() {
      return (
        this.error && this.error.response && this.error.response.status >= 500
      );
    },
    is404() {
      return (
        this.error && this.error.response && this.error.response.status == 404
      );
    },
    isTimeout() {
      return this.error && !this.error.response;
    },
  },
};
</script>
