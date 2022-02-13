<template>
  <v-avatar
    color="indigo"
    @click="$emit('click')"
    :class="user.name ? 'artist' : ''"
    v-bind="$attrs"
    min-width="48px"
    min-height="48px"
  >
    <img v-if="user.avatar && user.avatar != 'null'" :src="avatarUrl" />
    <span class="white--text" v-else>{{ upperInitials }}</span>
  </v-avatar>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: this.$t("component.user_avatar.label_unknown_initials"),
        };
      },
    },
  },
  computed: {
    upperInitials() {
      return (this.user
        ? this.user.displayName ||
          this.user.username ||
          this.user.name ||
          this.$t("component.user_avatar.label_unknown_initials")
        : this.$t("component.user_avatar.label_unknown_initials")
      )
        .substring(0, 2)
        .toUpperCase();
    },
    avatarUrl() {
      return this.$apiURL(`/api/resource/static/avatars/${this.user.avatar}`);
    },
  },
};
</script>

<style scoped>
.artist {
  cursor: pointer;
}
</style>
