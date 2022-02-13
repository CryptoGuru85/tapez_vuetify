<template>
  <v-data-table
    :items="apiData.docs"
    :headers="headers"
    :loading="loading"
    :options.sync="options"
    :server-items-length="apiData.total"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          <slot name="title">
            {{ $tc("model.report._name", 2) }}
          </slot>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          v-model="searchText"
          @change="fetchDocs"
        ></v-text-field>
        <v-divider vertical inset class="mx-4"></v-divider>
        <v-btn icon
          ><v-icon @click="filters.visible = !filters.visible"
            >mdi-filter</v-icon
          ></v-btn
        >
        <v-dialog v-model="forms.edit.open" max-width="350px">
          <v-card>
            <v-card-text>
              <v-form v-model="forms.edit.valid">
                <genre-form :value="editDoc"></genre-form> </v-form
            ></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="discardItem">{{
                $t("component.report_table.action_discard_item")
              }}</v-btn>
              <v-btn
                text
                color="primary"
                :disabled="!forms.edit.valid && !editDoc.$state.loading"
                @click="saveItem"
                >{{ $t("component.report_table.action_save_item") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-expand-transition>
        <v-container v-show="filters.visible">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-select
                dense
                hide-details
                item-text="text"
                item-value="item"
                :items="filters.status.items"
                v-model="filters.status.selected"
                @change="fetchDocs"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-expand-transition>
    </template>
    <template v-slot:item.$.status="{ item }">
      <v-chip small label v-if="item.$.status == 1">{{
        $t("model.report.status.PENDING")
      }}</v-chip>
      <v-chip small label v-if="item.$.status == 2" color="success">{{
        $t("model.report.status.APPROVED")
      }}</v-chip>
      <v-chip small label v-if="item.$.status == 3" color="error">{{
        $t("model.report.status.REJECTED")
      }}</v-chip>
    </template>
    <template v-slot:item.$.tape.title="{ item }">
      <router-link
        :to="{ name: 'tape-detail', params: { id: item.$.tape.alias } }"
        target="_blank"
        >{{ item.$.tape.title }}</router-link
      >
    </template>
    <template v-slot:item.$.reason="{ item }">
      {{ $t(`model.report.reason.${item.reasonMnemonic}`) }}
    </template>
    <template v-slot:item.$.user.displayName="{ item }">
      <span v-if="item.$.user && item.$.user.displayName">{{
        item.$.user.displayName
      }}</span>
      <span v-else class="text--secondary">{{
        $t("component.genre_table.columns.user.anonymous_user")
      }}</span>
    </template>
    <template v-slot:item.$.tracks="{ item }">
      <span v-if="item.$.tracks.length">
        <span v-for="(track, i) in item.$.tracks" :key="track._id"
          >{{ track.title
          }}<span v-if="i != item.$.tracks.length - 1">, </span></span
        >
      </span>
      <span v-else class="text--secondary">{{
        $t("component.genre_table.columns.tracks.no_tracks")
      }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        :disabled="!$can('approve', item) || !$can('lock', item.tape)"
        @click="approveAndLock(item)"
        color="success"
        >mdi-lock-check</v-icon
      >
      <v-icon :disabled="!$can('approve', item)" @click="approve(item)"
        >mdi-check</v-icon
      >
      <v-icon :disabled="!$can('reject', item)" @click="reject(item)"
        >mdi-close</v-icon
      >
      <v-icon
        :disabled="!$can('delete', item)"
        color="error"
        @click="deleteItem(item)"
        >mdi-trash-can</v-icon
      >
    </template>
  </v-data-table>
</template>

<script>
import GenreForm from "@/forms/Genre";
import Report from "@/service/Report";

export default {
  components: {
    GenreForm,
  },
  props: {
    query: {
      type: Array,
      default: () => [],
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      apiData: {},
      loading: false,
      editDoc: new Report(),
      filters: {
        visible: false,
        status: {
          selected: 1,
          items: [
            {
              text: this.$t("component.report_table.filter_status_all"),
              item: "",
            },
            { text: this.$t("model.report.status.PENDING"), item: 1 },
            { text: this.$t("model.report.status.APPROVED"), item: 2 },
            { text: this.$t("model.report.status.REJECTED"), item: 3 },
          ],
        },
      },
      headers: [
        {
          text: this.$t("component.report_table.columns.date"),
          value: "$.date",
          width: "12%",
        },
        {
          text: this.$t("model.report.status._name"),
          value: "$.status",
          width: "5%",
        },
        {
          text: this.$tc("model.report.tape", 1),
          value: "$.tape.title",
          width: "10%",
        },
        {
          text: this.$t("model.report.reason._name"),
          value: "$.reason",
          width: "9%",
        },
        {
          text: this.$tc("model.report.tracks", 2),
          value: "$.tracks",
          width: "20%",
        },
        {
          text: this.$t("model.report.description"),
          value: "$.description",
        },
        {
          text: this.$t("model.report.user"),
          value: "$.user.displayName",
          width: "10%",
        },
        {
          text: this.$t("model.report.ip"),
          value: "$.ip",
          width: "4%",
        },
        {
          text: this.$t("component.report_table._columns.actions"),
          value: "actions",
          align: "right",
          width: "14%",
        },
      ],
      options: {},
      searchText: "",
      forms: {
        edit: {
          open: false,
          valid: false,
        },
        delete: {
          open: false,
          valid: false,
        },
      },
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchDocs();
      },
      deep: true,
    },
  },
  computed: {
    fullQuery() {
      return this.query.concat([
        ["limit", this.options.itemsPerPage],
        ["q", this.searchText],
        ["page", this.options.page],
        ["sort", this.sortByQuery],
        ["populate", "tape,user,tracks"],
        ["status", this.filters.status.selected],
      ]);
    },
    sortByQuery() {
      return this.options.sortBy
        .map((item, i) => (this.options.sortDesc[i] == 1 ? `-${item}` : item))
        .join(",")
        .replace("$.", "");
    },
  },
  methods: {
    async fetchDocs() {
      this.loading = true;
      this.apiData = await Report.get(this.fullQuery);
      this.loading = false;
    },
    async approve(item) {
      await item.approve();
      this.fetchDocs();
    },
    async approveAndLock(item) {
      const reason = window.prompt(this.$t("model.tape.locks.reason"));
      await item.approveAndLock(reason);
      this.fetchDocs();
    },
    async reject(item) {
      await item.reject();
      this.fetchDocs();
    },
    async discardItem(item) {
      item.discard();
      this.forms.edit.open = false;
    },
    async deleteItem(item) {
      await item.delete();
      this.fetchDocs();
    },
    async saveItem() {
      await this.editDoc.save();
      this.forms.edit.open = false;
    },
  },
  mounted() {
    this.fetchDocs();
  },
};
</script>

<style scoped>
.tape-cover {
  max-width: 32px;
  max-height: 32px;
}
</style>
