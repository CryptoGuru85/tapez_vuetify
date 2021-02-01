<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-if="$can('update', user, 'username')"
        :label="$tc('model.user.username', 1)"
        v-model="user.username"
        :rules="[commonRules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-if="$can('update', user, 'firstname')"
        :label="$tc('model.user.firstname', 1) + '*'"
        v-model="user.firstname"
        :rules="[commonRules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-if="$can('update', user, 'lastname')"
        :label="$tc('model.user.lastname', 1) + '*'"
        v-model="user.lastname"
        :rules="[commonRules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-select
        v-if="$can('update', user, 'status')"
        :label="$t('model.user.status._name')"
        v-model="user.status"
        :items="stati"
      ></v-select>
    </v-col>
    <v-col cols="6">
      <v-select
        v-if="$can('update', user, 'role')"
        :label="$tc('model.user.role._name', 1)"
        v-model="user.role"
        :items="roles"
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-if="$can('update', user, 'email') + '*'"
        :label="$tc('model.user.email', 1)"
        v-model="user.email"
        :items="stati"
        :rules="[commonRules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-if="$can('update', user, 'password')"
        :label="$tc('model.user.password', 1)"
        v-model="user.password"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import commonRules from "../mixins/CommonRules";
import User from "@/service/User";

export default {
  props: ["value", "errors"],
  mixins: [commonRules],
  data() {
    return {
      user: new User(),
      stati: Object.entries(User.status).map((status) => ({
        text: this.$t(`model.user.status.${status[0]}`),
        value: status[1],
      })),
      roles: Object.entries(User.role).map((role) => ({
        text: this.$t(`model.user.role.${role[0]}`),
        value: role[1],
      })),
    };
  },
  watch: {
    user: {
      handler() {
        this.$emit("input", this.user);
      },
      deep: true,
    },
    value: {
      handler() {
        this.user = this.value;
      },
      deep: true,
    },
  },
  created() {
    this.user = this.value;
  },
};
</script>

<style></style>
