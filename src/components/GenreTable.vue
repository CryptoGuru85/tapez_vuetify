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
            {{ $tc("model.genre._name", 2) }}
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
          >{{ $t("component.genre_table.action_new_genre") }}</v-btn
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
                $t("component.genre_table.action_discard_item")
              }}</v-btn>
              <v-btn
                text
                color="primary"
                :disabled="!forms.edit.valid && !editDoc.$state.loading"
                @click="saveItem"
                >{{ $t("component.genre_table.action_save_item") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="forms.delete.open" max-width="350px">
          <v-card>
            <v-card-text>
              <v-form v-model="forms.delete.valid">
                <genre-picker
                  v-model="replaceGenre"
                  return-object
                ></genre-picker>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="discardDelete">{{
                $t("component.genre_table.action_discard_deletion")
              }}</v-btn>
              <v-btn
                text
                color="error"
                :disabled="!forms.delete.valid && !editDoc.$state.loading"
                @click="deleteItem"
                >{{ $t("component.genre_table.action_delete_item") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.$.name="{ item }">
      <genre-chip :genre="item.$" :link="false"></genre-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon :disabled="!$can('update', item)" @click="editItem(item)"
        >mdi-pencil</v-icon
      >
      <v-icon
        :disabled="!$can('delete', item)"
        color="red"
        @click="confirmDelete(item)"
        >mdi-trash-can</v-icon
      >
    </template>
  </v-data-table>
</template>

<script>
import GenreForm from "@/forms/Genre";
import Genre from "@/service/Genre";
import GenreChip from "@/components/GenreChip";
import GenrePicker from "@/components/GenrePicker";

export default {
  components: {
    GenreForm,
    GenreChip,
    GenrePicker,
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
      editDoc: new Genre(),
      replaceGenre: {},
      headers: [
        {
          text: this.$t("model.genre.name"),
          value: "$.name",
          width: "80%",
        },
        {
          text: this.$t("model.genre.id3_id"),
          value: "$.id3_id",
        },
        {
          text: this.$t("component.genre_table.text_action_header"),
          value: "actions",
          width: "9%",
          align: "right",
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
      this.apiData = await Genre.get(this.fullQuery);
      this.loading = false;
    },
    editItem(item) {
      this.editDoc = item;
      this.forms.edit.open = true;
    },
    saveItem() {
      this.editDoc.save();
      this.forms.edit.open = false;
    },
    addItem() {
      this.editDoc = new Genre();
      this.editDoc.color = "#ffffff";
      this.forms.edit.open = true;
    },
    discardItem() {
      this.editDoc.discard();
      this.forms.edit.open = false;
    },
    discardDelete() {
      this.editDoc.discard();
      (this.replaceGenre = {}), (this.forms.delete.open = false);
    },
    confirmDelete(item) {
      this.editDoc = item;
      this.forms.delete.open = true;
    },
    async deleteItem() {
      await this.editDoc.delete({
        replaceWith: this.replaceGenre._id,
      });
      this.forms.delete.open = false;
      this.fetchDocs();
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
