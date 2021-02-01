<template>
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        v-if="create || admin"
        :outlined="outlined"
        :label="$tc('model.artist.name', 1) + '*'"
        :value="value.name"
        :error-messages="errors && errors['name']"
        :rules="[
          commonRules.required,
          commonRules.minChars(2),
          commonRules.maxChars(32),
        ]"
        @input="$emit('input', { ...value, name: $event })"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :outlined="outlined"
        type="number"
        :label="$t('model.artist.active_since') + '*'"
        :value="value.activeSince"
        :rules="[commonRules.required, commonRules.year]"
        :error-messages="errors && errors['activeSince']"
        @input="$emit('input', { ...value, activeSince: $event })"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <genre-picker
        :outlined="outlined"
        :label="$tc('model.artist.main_genre', 1) + '*'"
        :value="
          value.mainGenre && value.mainGenre._id
            ? value.mainGenre._id
            : value.mainGenre
        "
        :rules="[commonRules.required]"
        :error-messages="errors && errors['mainGenre']"
        @input="$emit('input', { ...value, mainGenre: $event })"
      ></genre-picker>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :outlined="outlined"
        :label="$tc('model.artist.city', 1)"
        :value="value.city"
        :rules="[commonRules.maxChars(64)]"
        :error-messages="errors && errors['city']"
        @input="$emit('input', { ...value, city: $event })"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <country-picker
        :outlined="outlined"
        :label="$tc('model.artist.country', 1) + '*'"
        :value="value.country"
        :rules="[commonRules.required]"
        :error-messages="errors && errors['country']"
        @input="$emit('input', { ...value, country: $event })"
      ></country-picker>
    </v-col>
    <v-col cols="4">
      <v-text-field
        :outlined="outlined"
        dense
        prepend-inner-icon="mdi-facebook"
        :label="$t('model.artist.social_media.facebook')"
        :value="value.socialMedia && value.socialMedia.facebook"
        :error-messages="errors && errors['facebook']"
        @input="
          $emit('input', {
            ...value,
            socialMedia: {
              ...value.socialMedia,
              facebook: $event,
            },
          })
        "
      >
      </v-text-field>
    </v-col>
    <v-col cols="4">
      <v-text-field
        :outlined="outlined"
        dense
        prepend-inner-icon="mdi-twitter"
        :label="$t('model.artist.social_media.twitter')"
        :value="value.socialMedia && value.socialMedia.twitter"
        :error-messages="errors && errors['twitter']"
        @input="
          $emit('input', {
            ...value,
            socialMedia: {
              ...value.socialMedia,
              twitter: $event,
            },
          })
        "
      >
      </v-text-field>
    </v-col>
    <v-col cols="4">
      <v-text-field
        :outlined="outlined"
        dense
        prepend-inner-icon="mdi-instagram"
        :label="$t('model.artist.social_media.instagram')"
        :value="value.socialMedia && value.socialMedia.instagram"
        :error-messages="errors && errors['instagram']"
        @input="
          $emit('input', {
            ...value,
            socialMedia: {
              ...value.socialMedia,
              instagram: $event,
            },
          })
        "
      >
      </v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        :outlined="outlined"
        dense
        prepend-inner-icon="mdi-soundcloud"
        :label="$t('model.artist.social_media.soundcloud')"
        :value="value.socialMedia && value.socialMedia.soundcloud"
        :error-messages="errors && errors['soundcloud']"
        @input="
          $emit('input', {
            ...value,
            socialMedia: {
              ...value.socialMedia,
              soundcloud: $event,
            },
          })
        "
      >
      </v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        :outlined="outlined"
        dense
        prepend-inner-icon="mdi-home"
        :label="$t('model.artist.social_media.homepage')"
        :value="value.socialMedia && value.socialMedia.homepage"
        :error-messages="errors && errors['homepage']"
        @input="
          $emit('input', {
            ...value,
            socialMedia: {
              ...value.socialMedia,
              homepage: $event,
            },
          })
        "
      >
      </v-text-field>
    </v-col>
    <v-col cols="12">
      <v-textarea
        :outlined="outlined"
        :label="$t('model.artist.about')"
        :value="value.about"
        :rules="[commonRules.maxChars(1024)]"
        :error-messages="errors && errors['about']"
        counter="1024"
        @input="$emit('input', { ...value, about: $event })"
      ></v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import commonRules from "../mixins/CommonRules";
import GenrePicker from "@/components/GenrePicker.vue";
import CountryPicker from "@/components/CountryPicker.vue";

export default {
  components: {
    GenrePicker,
    CountryPicker,
  },
  props: {
    artist: {
      type: Object,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
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
  },
  watch: {
    value: {
      handler(newVal) {
        this.data = newVal;
      },
      deep: true,
    },
  },
  mixins: [commonRules],
};
</script>

<style></style>
