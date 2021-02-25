<template>
  <div>
    <v-row dense v-if="!noSubmit && loggedIn">
      <v-col cols="auto">
        <user-avatar :user="alias"></user-avatar>
        <alias-picker>
          <template v-slot:activator="{ on }">
            <v-btn small text v-on="on" class="ml-1"
              ><v-icon>mdi-menu-down</v-icon></v-btn
            >
          </template>
        </alias-picker>
      </v-col>
      <v-col>
        <v-textarea
          v-if="$can('create', 'Comment')"
          v-model="newComment"
          @click:append="submit"
          @submit="submit"
          @input="error = ''"
          @keypress.enter.prevent="handleEnter"
          :placeholder="$t('component.comment_list.comment_input_placeholder')"
          append-icon="mdi-send"
          rows="1"
          no-resize
          auto-grow
          :loading="loading"
          :error-messages="error"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row dense v-if="!loggedIn">
      <v-col cols="12">
        <i18n path="component.comment_list.need_to_login_text" tag="small">
          <template v-slot:action>
            <router-link :to="{ name: 'login' }">{{
              $t("component.comment_list.action_login")
            }}</router-link>
          </template>
        </i18n>
      </v-col>
    </v-row>
    <comment-item
      v-for="comment in orderedComments"
      :key="comment._id"
      :comment="comment"
      class="mb-2"
    ></comment-item>
  </div>
</template>

<script>
import CommentItem from "./CommentItem.vue";
import AliasPicker from "./AliasPicker.vue";
import UserAvatar from "./UserAvatar.vue";
import { compareDesc, parseJSON } from "date-fns";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    CommentItem,
    AliasPicker,
    UserAvatar,
  },
  props: {
    comments: {
      type: Array,
      default: () => [],
    },
    noSubmit: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
    },
  },
  data() {
    return {
      newComment: "",
      loading: false,
      error: "",
    };
  },
  computed: {
    orderedComments() {
      return [...this.comments].sort((a, b) =>
        compareDesc(parseJSON(a.createdAt), parseJSON(b.createdAt))
      );
    },
    ...mapState(["user", "loggedIn", "aliasId"]),
    ...mapGetters(["alias"]),
  },
  methods: {
    submit() {
      if (this.to && this.newComment) {
        this.loading = true;
        this.$http
          .post(this.to, {
            content: this.newComment,
            as: this.aliasId ? this.aliasId : this.user._id,
          })
          .then((result) => result.data)
          .then((data) => this.comments.push(data))
          .then(() => (this.newComment = ""))
          .catch((err) => {
            this.$store.dispatch("ajaxError", err);
          })
          .then(() => (this.loading = false));
      }
    },
    handleEnter(e) {
      if (e.shiftKey) this.newComment += "\r\n";
      else this.submit();
    },
  },
};
</script>

<style></style>
