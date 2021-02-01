<template>
  <v-container>
    <statistics-provider
      :query="[['owner', $store.state.user._id]]"
      v-slot="statistics"
      :from="range.from"
      :to="range.to"
    >
      <div>
        <v-row>
          <v-col cols="auto">
            <h1>
              {{ $t("view.acp.dashboard.heading_statistics") }}
            </h1>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              hide-details
              solo
              v-model="range"
              :items="ranges"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col xl="4" lg="4" md="12" sm="12" cols="12">
            <metrics-snack-card
              color="green"
              icon="mdi-eye"
              :text="$tc('view.acp.dashboard.title_metrics_snack_views', 2)"
              dark
              class="h-100"
              :statistics="statistics"
              :filter="(entry) => entry.type == 'view'"
            >
            </metrics-snack-card>
          </v-col>
          <v-col xl="4" lg="4" md="12" sm="12" cols="12">
            <metrics-snack-card
              color="blue"
              :text="$tc('view.acp.dashboard.title_metrics_snack_downloads', 2)"
              class="h-100"
              icon="mdi-download"
              :statistics="statistics"
              :filter="(entry) => entry.type == 'download'"
              dark
            >
            </metrics-snack-card>
          </v-col>
          <v-col xl="4" lg="4" md="12" sm="12" cols="12">
            <metrics-snack-card
              color="blue-grey"
              :text="$tc('view.acp.dashboard.title_metrics_snack_plays', 2)"
              icon="mdi-play-circle-outline"
              class="h-100"
              :statistics="statistics"
              :filter="(entry) => entry.type == 'play'"
              dark
            >
            </metrics-snack-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                {{ $t("view.acp.dashboard.title_user_activity_metrics_chart") }}
              </v-card-title>
              <v-card-text>
                <user-activity-metrics-chart
                  :statistics="statistics"
                ></user-activity-metrics-chart>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="4">
            <v-card class="toplist-card">
              <v-card-title>{{
                $t("view.acp.dashboard.title_top_views")
              }}</v-card-title>
              <v-card-text>
                <document-toplist
                  :statistics="statistics"
                  :count-filter="(entry) => entry.type == 'view'"
                  :item-filter="(item) => item.document._type == 'Tape'"
                ></document-toplist>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4">
            <v-card class="toplist-card">
              <v-card-title>{{
                $t("view.acp.dashboard.title_top_downloads")
              }}</v-card-title>
              <v-card-text>
                <document-toplist
                  :statistics="statistics"
                  :count-filter="(entry) => entry.type == 'download'"
                  :item-filter="(item) => item.document._type == 'Tape'"
                ></document-toplist>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4">
            <v-card class="toplist-card">
              <v-card-title>{{
                $t("view.acp.dashboard.title_top_plays")
              }}</v-card-title>
              <v-card-text>
                <document-toplist
                  :statistics="statistics"
                  :count-filter="(entry) => entry.type == 'play'"
                  :item-filter="(item) => item.document._type == 'Track'"
                >
                  <template v-slot:cover="{ item }">
                    <tape-cover :tape="item.document.tape"></tape-cover>
                  </template>
                </document-toplist>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </statistics-provider>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text
            ><tape-table :query="[['user', $store.state.user._id]]"></tape-table
          ></v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import MetricsSnackCard from "./../components/MetricsSnackCard";
import StatisticsProvider from "./../components/StatisticsProvider";
import TapeTable from "./../components/TapeTable";
import UserActivityMetricsChart from "./../components/UserActivityMetricsChart";
import DocumentToplist from "./../components/DocumentToplist";
import TapeCover from "@/components/TapeCover";

import subDate from "date-fns/sub";

export default {
  components: {
    MetricsSnackCard,
    StatisticsProvider,
    TapeTable,
    UserActivityMetricsChart,
    DocumentToplist,
    TapeCover,
  },
  head: {
    title() {
      return {
        inner: this.$t("view.user_tapes.title"),
      };
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.range = this.ranges[0];
  },
  data() {
    return {
      range: {
        text: this.$t("view.acp.dashboard.filter_date_range_24h"),
        value: {
          from: subDate(new Date(), { days: 1 }),
          to: new Date(),
        },
      },
      ranges: [
        {
          text: this.$t("view.acp.dashboard.filter_date_range_24h"),
          value: {
            from: subDate(new Date(), { days: 1 }),
            to: new Date(),
          },
        },
        {
          text: this.$t("view.acp.dashboard.filter_date_range_27d"),
          value: {
            from: subDate(new Date(), { weeks: 1 }),
            to: new Date(),
          },
        },
        {
          text: this.$t("view.acp.dashboard.filter_date_range_4w"),
          value: {
            from: subDate(new Date(), { weeks: 4 }),
            to: new Date(),
          },
        },
      ],
    };
  },
};
</script>

<style>
.toplist-card {
  height: 100%;
}
</style>
