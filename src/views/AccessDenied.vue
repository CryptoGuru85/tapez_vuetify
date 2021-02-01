<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="7" class="text-center">
        <div class="text-h3">
          {{ $t("view.access_denied.title") }}
        </div>
        <div class="text-h5">
          {{ $t("view.access_denied.subtitle") }}
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
        inner: this.$t("view.access_denied.title"),
      };
    },
  },
};
</script>

<style></style>
