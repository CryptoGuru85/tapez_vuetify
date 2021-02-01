<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="7" class="text-center">
        <div class="text-h3">
          {{ $t("view.404.title") }}
        </div>
        <div class="text-h5">
          {{ $t("view.404.subtitle") }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head: {
    title() {
      return {
        inner: this.$t("view.404.title"),
      };
    },
  },
};
</script>

<style></style>
