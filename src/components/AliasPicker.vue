<template>
  <v-menu @input="$event ? $emit('open') : $emit('close')">
    <template v-slot:activator="{ on }">
      <slot name="activator" v-bind:on="on"></slot>
    </template>
    <v-list>
      <v-list-item
        two-line
        v-for="alias in availableAliases"
        :key="alias._id"
        link
        @click="SET_ALIAS_ID(alias._id)"
      >
        <v-list-item-avatar class="mr-1">
          <user-avatar :user="alias" small></user-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ alias.displayName || alias.username || alias.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <span v-if="alias.username">{{ $t("model.user._name") }}</span>
            <span v-else>{{ $t("model.artist._name") }}</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import UserAvatar from "./UserAvatar.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    UserAvatar,
  },
  computed: {
    ...mapGetters(["availableAliases"]),
  },
  methods: {
    ...mapMutations(["SET_ALIAS_ID"]),
  },
};
</script>

<style></style>
