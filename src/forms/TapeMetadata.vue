<template>
  <v-row dense>
    <v-col cols="12" v-if="allowed('title')">
      <v-text-field
        :outlined="outlined"
        v-model="tape.title"
        :rules="[
          commonRules.required,
          commonRules.minChars(3),
          commonRules.maxChars(500),
        ]"
        validate-on-blur
        :label="`${$t('model.tape.title')} *`"
      ></v-text-field>
    </v-col>
    <v-col cols="12" v-if="allowed('artist')">
      <v-select
        :items="tape.user.artists"
        v-model="tape.artist"
        item-text="name"
        return-object
        :outlined="outlined"
        :rules="[commonRules.required]"
        validate-on-blur
        :label="`${$t('model.tape.artist')} *`"
      ></v-select>
    </v-col>
    <v-col cols="12" v-if="allowed('alias') && !create">
      <v-text-field
        :outlined="outlined"
        v-model="value.alias"
        :rules="[
          commonRules.required,
          commonRules.minChars(3),
          commonRules.maxChars(500),
        ]"
        validate-on-blur
        :label="`${$t('model.tape.alias')} *`"
      ></v-text-field>
    </v-col>
    <v-col cols="12" v-if="allowed('status') && !create">
      <v-select
        :outlined="outlined"
        v-model="value.status"
        :items="status"
        item-text="text"
        item-value="item"
        :label="$t('model.tape.status._name')"
      ></v-select>
    </v-col>
    <v-col cols="6" v-if="allowed('views') && !create">
      <v-text-field
        type="number"
        :outlined="outlined"
        v-model="value.views"
        :label="$t('model.tape.views')"
      ></v-text-field>
    </v-col>
    <v-col cols="6" v-if="allowed('downloads') && !create">
      <v-text-field
        type="number"
        :outlined="outlined"
        v-model="value.downloads"
        :label="$t('model.tape.downloads')"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6" v-if="allowed('year')">
      <v-text-field
        :outlined="outlined"
        v-model="tape.year"
        :rules="[commonRules.required, commonRules.year]"
        validate-on-blur
        :label="`${$t('model.tape.year')} *`"
      ></v-text-field>
    </v-col>
    <v-col cols="6" v-if="allowed('cover')">
      <v-file-input
        :outlined="outlined"
        v-model="tape.cover"
        :rules="create ? [commonRules.required] : []"
        :label="`${$t('model.tape.cover')} *`"
        :hint="$t('form.tape_metadata.hint_upload')"
        persistent-hint
        accept="image/jpeg,image/png,image/tiff"
      ></v-file-input>
    </v-col>
    <v-col cols="6" v-if="allowed('genre')">
      <genre-picker
        v-model="tape.genre"
        :label="`${$tc('model.tape.genre', 1)} *`"
        :rules="[commonRules.required]"
        validate-on-blur
        :outlined="outlined"
        :return-object="returnGenreObject"
      ></genre-picker>
    </v-col>
    <v-col cols="6" v-if="allowed('subgenre')">
      <v-text-field
        :outlined="outlined"
        v-model="tape.subgenre"
        :label="$t('model.tape.subgenre')"
      ></v-text-field>
    </v-col>
    <v-col cols="12" v-if="allowed('description')">
      <v-textarea
        :outlined="outlined"
        v-model="tape.description"
        :rules="[
          commonRules.required,
          commonRules.minChars(6),
          commonRules.maxChars(1024),
        ]"
        :label="`${$t('model.tape.description')} *`"
      ></v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import commonRules from "../mixins/CommonRules";
import GenrePicker from "@/components/GenrePicker.vue";
import { mapState } from "vuex";

export default {
  components: {
    GenrePicker,
  },
  props: {
    value: {
      type: Object,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object,
      default: () => {},
    },
    admin: {
      type: Boolean,
      default: false,
    },
    create: {
      type: Boolean,
      default: false,
    },
    returnGenreObject: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [commonRules],
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    value() {
      this.tape = this.value;
    },
    tape() {
      this.$emit("input", this.tape);
    },
  },
  created() {
    this.tape = this.value;
  },
  data() {
    return {
      tape: null,
      status: [
        { text: this.$t("model.tape.status.OK"), item: 1 },
        { text: this.$t("model.tape.status.PROCESSING"), item: 2 },
      ],
    };
  },
  methods: {
    allowed(field) {
      return this.$can(
        this.create ? "create" : "update",
        this.create ? "Tape" : this.value,
        field
      );
    },
  },
};
</script>
