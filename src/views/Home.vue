<template>
  <v-container class="home">
    <v-row>
      <v-col cols="12">
        <h3>{{ $t("view.home.title_recommended") }}</h3>
      </v-col>
      <v-col cols="12" lg="8">
        <v-sheet elevation="5">
          <v-skeleton-loader
            type="image@3"
            max-height="600px"
            :loading="!loadingStates.mostDownloadedTapes"
          >
            <tape-carousel :tapes="mostDownloadedTapes"></tape-carousel>
          </v-skeleton-loader>
        </v-sheet>
      </v-col>
      <v-col cols="12" lg="4">
        <v-container fluid fill-height class="ma-0 py-0 pl-0">
          <v-row no-gutters class="fill-height pr-3">
            <v-col cols="12" class="mb-3">
              <v-card class="fill-height">
                <v-card-title>
                  <span>Künstler</span>
                  <v-spacer></v-spacer
                  ><v-icon>mdi-arrow-right</v-icon></v-card-title
                >
              </v-card>
            </v-col>
            <v-col cols="12" class="mb-3">
              <v-card class="fill-height">
                <v-card-title>
                  <span>Neuerscheinungen</span>
                  <v-spacer></v-spacer
                  ><v-icon>mdi-arrow-right</v-icon></v-card-title
                >
              </v-card>
            </v-col>
            <v-col cols="12" class="mb-3">
              <v-card class="fill-height">
                <v-card-title>
                  <span>Genres</span>
                  <v-spacer></v-spacer
                  ><v-icon>mdi-arrow-right</v-icon></v-card-title
                >
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card class="fill-height">
                <v-card-title>
                  <span>Empfehlungen</span>
                  <v-spacer></v-spacer
                  ><v-icon>mdi-arrow-right</v-icon></v-card-title
                >
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"
        ><h3>{{ $t("view.home.label_newest_tapes") }}</h3></v-col
      >
    </v-row>
    <tape-card-row :tapes="recentTapes"></tape-card-row>
    <v-row>
      <v-col cols="12"
        ><h3>{{ $t("view.home.label_most_downloaded_tapes") }}</h3></v-col
      >
    </v-row>
    <tape-card-row :tapes="mostDownloadedTapes"></tape-card-row>
    <v-row>
      <v-col cols="12"
        ><h3>{{ $t("view.home.label_most_viewed_tapes") }}</h3></v-col
      >
    </v-row>
    <tape-card-row :tapes="mostViewedTapes"></tape-card-row>

    <v-sheet
      color="dark"
      dark
      elevation="5"
      justify="center"
      class="pa-12 my-6"
      width="100%"
    >
      <v-row justify="center">
        <v-col cols="12">
          <h2 class="text-center">
            {{ $t("view.home.title_bottom_sheet") }}
          </h2>
        </v-col>
        <v-col cols="6">
          <h4 class="text-center">
            {{ $t("view.home.subtitle_bottom_sheet") }}
          </h4>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn color="primary" raised x-large :to="{ name: 'tape-upload' }">{{
            $t("view.home.action_upload_tape")
          }}</v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
import TapeCarousel from "../components/TapeCarousel.vue";
// @ is an alias to /src
import TapeCardRow from "@/components/TapeCardRow.vue";

export default {
  name: "home",
  head: {
    title() {
      return {
        inner: this.$t("view.home.title"),
        separator: " ",
        complement: " ",
      };
    },
  },
  components: {
    TapeCardRow,
    TapeCarousel,
  },
  data() {
    return {
      recentTapes: [{}, {}, {}, {}, {}, {}],
      mostDownloadedTapes: [{}, {}, {}, {}, {}, {}],
      mostViewedTapes: [{}, {}, {}, {}, {}, {}],
      currentCarousel: 0,
      loadingStates: {
        recentTapes: false,
        mostDownloadedTapes: false,
        mostViewedTapes: false,
      },
    };
  },
  mounted() {
    this.$http
      .get("/api/tape?sort=-createdAt&limit=6")
      .then((data) => (this.recentTapes = data.data.docs))
      .catch((err) => {
        this.$store.dispatch("ajaxError", err);
        this.loadingStates.recentTapes = true;
      });
    this.$http
      .get("/api/tape?sort=-views&limit=6")
      .then((data) => {
        this.mostViewedTapes = data.data.docs;
        this.loadingStates.mostViewedTapes = true;
      })
      .catch((err) => {
        this.$store.dispatch("ajaxError", err);
      });
    this.$http
      .get("/api/tape?sort=-downloads&limit=6")
      .then((data) => {
        this.mostDownloadedTapes = data.data.docs;
        this.loadingStates.mostDownloadedTapes = true;
      })
      .catch((err) => {
        this.$store.dispatch("ajaxError", err);
      });
  },
};
</script>
