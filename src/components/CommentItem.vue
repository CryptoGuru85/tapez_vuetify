<template>
  <v-row class="comment">
    <v-col cols="auto"><user-avatar :user="comment.by"></user-avatar></v-col>
    <v-col>
      <div class="username">
        <router-link
          v-if="comment.by.name"
          :to="{ name: 'artist-profile', params: { id: comment.by._id } }"
          class="mr-1"
          >{{ comment.by.displayName }}</router-link
        >
        <strong class="mr-1" v-else>{{ comment.by.displayName }}</strong>
        <small>{{ dateDistance }}</small>
      </div>
      <div class="content">
        {{ comment.content }}
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { formatDistanceToNow, parseJSON } from "date-fns";
import { de, enUS } from "date-fns/locale";
import UserAvatar from "./UserAvatar";

export default {
  components: {
    UserAvatar,
  },
  computed: {
    dateDistance() {
      const locales = {
        de: de,
        en: enUS,
      };
      if (this.comment.createdAt)
        return formatDistanceToNow(parseJSON(this.comment.createdAt), {
          addSuffix: true,
          locale: locales[this.$i18n.locale],
        });
      else return formatDistanceToNow(new Date());
    },
  },
  props: {
    comment: {
      type: Object || String,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.username a {
  text-decoration: none;
  font-weight: bold;
}
</style>
