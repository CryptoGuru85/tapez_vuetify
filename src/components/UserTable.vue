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
            {{ $tc("model.user._name", 2) }}
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
          >{{ $t("component.user_table.action_new_item") }}</v-btn
        >
        <v-dialog v-model="forms.edit.open" max-width="350px">
          <v-card>
            <v-card-text>
              <v-form v-model="forms.edit.valid">
                <user-form v-model="editDoc"></user-form> </v-form
            ></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="discardItem">{{
                $t("component.user_table.action_discard_item")
              }}</v-btn>
              <v-btn
                text
                color="primary"
                :disabled="!forms.edit.valid && !editDoc.$state.loading"
                @click="saveItem"
                >{{ $t("component.user_table.action_save_item") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.avatar="{ item }">
      <user-avatar tile :user="item.$"></user-avatar>
    </template>
    <template v-slot:item.role="{ item }">
      {{ $tc("model.user.role._choice", item.role) }}
    </template>
    <template v-slot:item.status="{ item }">
      {{ $tc("model.user.status._choice", item.status) }}
    </template>
    <template v-slot:item.legacy="{ item }">
      <v-icon v-if="item.$.legacy" color="red lighten-3">mdi-alpha-l</v-icon>
      <v-icon v-else color="green lighten-3">mdi-alpha-n</v-icon>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon :disabled="!$can('update', item)" @click="editItem(item)"
        >mdi-pencil</v-icon
      >
      <v-icon
        v-if="item.status == 0"
        :disabled="!$can('unban', item)"
        @click="unbanItem(item)"
        >mdi-lock</v-icon
      >
      <v-icon v-else :disabled="!$can('ban', item)" @click="banItem(item)"
        >mdi-lock-open</v-icon
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
import UserForm from "@/forms/User";
import User from "@/service/User";
import UserAvatar from "@/components/UserAvatar";

export default {
  components: {
    UserForm,
    UserAvatar,
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
      editDoc: new User(),
      replaceGenre: {},
      headers: [
        {
          text: this.$tc("component.user_table.columns.avatar", 1),
          value: "avatar",
          width: "6%",
        },
        {
          text: this.$t("component.user_table.columns.legacy"),
          value: "legacy",
          width: "6%",
        },
        {
          text: this.$tc("component.user_table.columns.role", 1),
          value: "role",
          width: "6%",
        },
        {
          text: this.$tc("component.user_table.columns.status", 1),
          value: "status",
          width: "5%",
        },
        {
          text: this.$t("component.user_table.columns.user"),
          value: "$.username",
        },
        {
          text: this.$tc("component.user_table.columns.email", 1),
          value: "$.email",
          width: "25%",
        },
        {
          text: this.$tc("component.user_table.columns.firstname", 1),
          value: "$.firstname",
          width: "10%",
        },
        {
          text: this.$tc("component.user_table.columns.lastname", 1),
          value: "$.lastname",
          width: "10%",
        },
        {
          text: this.$t("component.user_table.columns.actions"),
          value: "actions",
          width: "10%",
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
      this.apiData = await User.get(this.fullQuery);
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
      this.editDoc = new User();
      this.editDoc.color = "#ffffff";
      this.forms.edit.open = true;
    },
    discardItem() {
      this.editDoc.discard();
      this.forms.edit.open = false;
    },
    banItem(item) {
      item.ban();
    },
    unbanItem(item) {
      item.unban();
    },
    async deleteItem(item) {
      if (!confirm(this.$t("common.delete_confirm", { item: item.username })))
        return;
      await item.delete();
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
