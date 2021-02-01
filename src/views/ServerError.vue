<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="7" class="text-center">
        <div class="text-h3">
          {{ error.response.status }}
        </div>
        <div class="text-h5">
          {{ $t("view.server_error.subtitle") }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    error: {
      type: Error,
    },
  },
  head: {
    title() {
      return {
        inner: this.$t("view.server_Error.title"),
      };
    },
  },
};
</script>

<style></style>
