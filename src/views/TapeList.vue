<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              outlined
              clearable
              :placeholder="$t('view.tape_list.placeholder_search')"
              v-model="searchText"
              @change="reloadTapes"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-select
              :items="sorts"
              item-text="text"
              item-value="value"
              :label="$t('view.tape_list.label_sorting')"
              outlined
              dense
              v-model="sort"
              @input="reloadTapes"
            >
            </v-select>
          </v-col>
          <v-col cols="4">
            <genre-picker
              outlined
              dense
              clearable
              multiple
              :label="$t('view.tape_list.label_genre')"
              v-model="genres"
              @input="reloadTapes"
            ></genre-picker>
          </v-col>
          <v-col cols="12">
            {{ $tc("view.tape_list.text_result_count", totalCount) }}
          </v-col>
          <v-col cols="12">
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
              :disabled="state == 'error'"
              @input="reloadTapes"
            ></v-pagination>
          </v-col>
          <v-col cols="12" v-if="state != 'error'">
            <v-list v-if="this.state == 'success'">
              <div v-for="tape in tapes" :key="tape._id">
                <v-list-item
                  :to="{ name: 'tape-detail', params: { id: tape._id } }"
                >
                  <v-row>
                    <v-col cols="auto">
                      <tape-cover
                        :tape="tape"
                        width="100"
                        height="100"
                      ></tape-cover>
                    </v-col>
                    <v-col cols="auto">
                      <h2>{{ tape.title }}</h2>
                      <h3>{{ tape.artist.name }}</h3>
                      <tape-rating readonly dense :tape="tape"></tape-rating>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>
              </div>
            </v-list>
            <v-list v-else-if="this.state == 'loading'">
              <v-list-item v-for="i in 10" :key="i">
                <v-row>
                  <v-col cols="2">
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </v-col>
                  <v-col cols="10">
                    <v-skeleton-loader
                      type="heading"
                      class="mb-2"
                    ></v-skeleton-loader>
                    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
                  </v-col>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col v-else>
            <p>{{ $t("view.tape_list.text_no_results") }}</p>
          </v-col>
          <v-col cols="12">
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
              @input="reloadTapes"
              :disabled="state == 'error'"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TapeRating from "@/components/TapeRating.vue";
import GenrePicker from "@/components/GenrePicker.vue";
import TapeCover from "@/components/TapeCover.vue";

export default {
  components: {
    TapeRating,
    GenrePicker,
    TapeCover,
  },
  head: {
    title() {
      return {
        inner: this.$t("view.tape_list.title"),
      };
    },
  },
  data() {
    return {
      page: 1,
      perPage: 10,
      pageCount: 0,
      totalCount: 0,
      tapes: [],
      genres: [],
      searchText: "",
      state: "loading",
      sort: "-createdAt",
      sorts: [
        {
          text: this.$t("view.tape_list.filter_order_by_date_asc"),
          value: "createdAt",
        },
        {
          text: this.$t("view.tape_list.filter_order_by_date_desc"),
          value: "-createdAt",
        },
        {
          text: this.$t("view.tape_list.filter_order_by_rating_asc"),
          value: "rating",
        },
        {
          text: this.$t("view.tape_list.filter_order_by_rating_desc"),
          value: "-rating",
        },
        {
          text: this.$t("view.tape_list.filter_order_by_date_views_asc"),
          value: "views",
        },
        {
          text: this.$t("view.tape_list.filter_order_by_views_desc"),
          value: "-views",
        },
      ],
    };
  },

  mounted() {
    if (this.$route.query.q) this.searchText = this.$route.query.q;
    if (this.$route.query.sort) this.sort = this.$route.query.sort;
    if (this.$route.query.genres)
      this.genres = this.$route.query.genres.split(",");
    if (this.$route.query.page) this.page = Number(this.$route.query.page);
    this.reloadTapes(false);
  },

  methods: {
    reloadTapes(pushRouteParams = true) {
      if (pushRouteParams) this.pushRouteParams();
      this.state = "loading";
      this.$http
        .get(
          this.$apiURL(`/api/tape`, [
            ["q", this.searchText],
            ["sort", this.sort],
            ["genre", this.genres.join(",")],
            ["page", this.page],
          ])
        )
        .then((data) => {
          this.tapes = data.data.docs;
          this.pageCount = data.data.totalPages;
          this.totalCount = data.data.total;
          this.page = Number(data.data.page);
          this.state = "success";
        })
        .catch((err) => this.$store.dispatch("ajaxError", err));
    },
    pushRouteParams() {
      this.$router.push({
        name: "tape-list",
        query: {
          q: this.searchText,
          sort: this.sort,
          genres: this.genres.join(","),
          page: this.page,
        },
      });
    },
  },
};
</script>

<style></style>
