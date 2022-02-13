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
            {{ $tc("model.tape._name", 2) }}
          </slot>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          v-model="searchText"
          @change="fetchDocs"
        ></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn color="green" dark class="mb-2" @click="addItem"
          ><v-icon>mdi-plus</v-icon
          >{{ $t("component.tape_table.action_new_tape") }}</v-btn
        >
        <v-dialog v-model="forms.meta.open" max-width="900px">
          <v-card>
            <v-card-text>
              <v-form v-model="forms.meta.valid">
                <tape-metadata-form
                  v-model="editDoc"
                  :admin="admin"
                ></tape-metadata-form></v-form
            ></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="discardItem">{{
                $t("component.tape_table.action_discard_item")
              }}</v-btn>
              <v-btn
                text
                color="primary"
                :disabled="!forms.meta.valid && !editDoc.$state.loading"
                @click="saveItem"
                >{{ $t("component.tape_table.action_save_item") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="forms.tracks.open" max-width="900px">
          <v-card>
            <v-card-text>
              <v-form
                v-model="forms.tracks.valid"
                :disabled="editDoc.$state.loading"
              >
                <draggable-track-list
                  hide-details
                  no-delete
                  v-model="editDoc.tracks"
                ></draggable-track-list></v-form
            ></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="discardItem">{{
                $t("component.tape_table.action_discard_item")
              }}</v-btn>
              <v-btn
                text
                color="primary"
                :disabled="!forms.tracks.valid && !editDoc.$state.loading"
                @click="saveTracks"
                >{{ $t("component.tape_table.action_save_item") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.link="{ item }">
      <router-link
        :to="{ name: 'tape-detail', params: { id: item.alias } }"
        target="_blank"
        class="text-decoration-none"
        ><v-icon>mdi-open-in-new</v-icon></router-link
      >
    </template>
    <template v-slot:item.$.cover="{ item }">
      <tape-cover :tape="item" class="tape-cover"></tape-cover>
    </template>
    <template v-slot:item.rating="{ item }">
      <tape-rating dense :tape="item.$" readonly></tape-rating>
    </template>
    <template v-slot:item.comments="{ item }">
      {{ item.$.comments.length }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon :disabled="!$can('update', item)" @click="editItem(item)"
        >mdi-pencil</v-icon
      >
      <v-icon
        :disabled="!$can('update', item, 'tracks')"
        @click="editTracks(item)"
        >mdi-playlist-edit</v-icon
      >
      <v-icon v-if="$can('lock', item) && !item.locked" @click="item.lock()"
        >mdi-lock-open</v-icon
      >
      <v-icon v-if="$can('unlock', item) && item.locked" @click="item.unlock()"
        >mdi-lock</v-icon
      >
      <v-icon
        :disabled="!$can('delete', item)"
        color="red"
        @click="deleteItem(item)"
        >mdi-trash-can</v-icon
      >
    </template>
  </v-data-table>
</template>

<script>
import TapeRating from "./TapeRating";
import TapeCover from "@/components/TapeCover";
import TapeMetadataForm from "@/forms/TapeMetadata";
import Tape from "@/service/Tape";
import DraggableTrackList from "@/components/DraggableTrackList";

export default {
  components: {
    TapeRating,
    TapeCover,
    TapeMetadataForm,
    DraggableTrackList,
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
      editDoc: new Tape(),
      headers: [
        {
          text: this.$t("component.tape_table.columns.link"),
          value: "link",
          width: "3%",
          sortable: false,
        },
        {
          text: this.$t("component.tape_table.columns.cover"),
          value: "$.cover",
          sortable: false,
          width: "3%",
        },
        {
          text: this.$t("component.tape_table.columns.title"),
          value: "$.title",
        },
        {
          text: this.$t("component.tape_table.columns.artist"),
          value: "$.artist.name",
          width: "20%",
        },
        {
          text: this.$t("component.tape_table.columns.views"),
          value: "$.views",
          width: "5%",
        },
        {
          text: this.$t("component.tape_table.columns.downloads"),
          value: "$.downloads",
          width: "7%",
        },
        {
          text: this.$t("component.tape_table.columns.year"),
          value: "$.year",
          width: "5%",
        },
        {
          text: this.$t("component.tape_table.columns.comments"),
          value: "comments",
          width: "7%",
        },
        {
          text: this.$t("component.tape_table.columns.rating"),
          value: "rating",
          width: "9%",
        },
        {
          text: this.$t("component.tape_table.columns.actions"),
          value: "actions",
          width: "9%",
          align: "right",
        },
      ],
      options: {},
      searchText: "",
      forms: {
        meta: {
          open: false,
          valid: false,
        },
        tracks: {
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
        ["populate", "user,user.artists,artist"],
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
      this.apiData = await Tape.get(this.fullQuery);
      this.loading = false;
    },
    editItem(item) {
      this.editDoc = item;
      this.forms.meta.open = true;
    },
    saveItem() {
      this.editDoc.save();
      this.forms.meta.open = false;
    },
    discardItem() {
      this.editDoc.discard();
      this.forms.meta.open = false;
      this.forms.tracks.open = false;
    },
    addItem() {
      this.$router.push({
        name: "tape-upload",
      });
    },
    async deleteItem(item) {
      if (!confirm(this.$t("common.delete_confirm", { item: item.title })))
        return;
      await item.delete();
      this.fetchDocs();
    },
    editTracks(item) {
      this.editDoc = item;
      this.forms.tracks.open = true;
    },
    saveTracks() {
      this.editDoc.saveTracks();
      this.forms.tracks.open = false;
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
