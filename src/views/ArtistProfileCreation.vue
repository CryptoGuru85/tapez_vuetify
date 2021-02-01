<template>
  <div class="fill-height">
    <v-container fill-height fluid v-if="user.artists.length >= 10">
      <v-row justify="center" align="center">
        <v-col cols="12" md="7" class="text-center">
          <div class="text-h3">
            {{
              $t("view.artist_profile_creation.title_max_artist_count_reached")
            }}
          </div>
          <div class="text-h5">
            {{
              $t(
                "view.artist_profile_creation.subtitle_max_artist_count_reached"
              )
            }}
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container fill-height v-else-if="completed">
      <v-row justify="center" align="center">
        <v-col cols="12" md="7" class="text-center">
          <div class="text-h3">
            {{ $t("view.artist_profile_creation.title_profile_created") }}
          </div>
          <div class="text-h5">
            {{
              $t("view.artist_profile_creation.subtitle_profile_created", {
                name: artist.name,
              })
            }}
          </div>
          <div>
            <v-btn x-large color="primary" :to="{ name: 'tape-upload' }">{{
              $t("view.artist_profile_creation.action_upload_tape")
            }}</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="12" md="5">
          <v-card>
            <v-card-title>{{
              $t("view.artist_profile_creation.title_create_artist_profile")
            }}</v-card-title>
            <v-card-subtitle>{{
              $t("view.artist_profile_creation.subtitle_create_artist_profile")
            }}</v-card-subtitle>
            <v-card-text>
              <v-form v-model="valid">
                <artist-profile-form
                  create
                  outlined
                  v-model="artist"
                ></artist-profile-form>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="createArtist" :disabled="false">
                {{
                  $t(
                    "view.artist_profile_creation.action_create_artist_profile"
                  )
                }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ArtistProfileForm from "@/forms/ArtistProfile.vue";

export default {
  components: {
    ArtistProfileForm,
  },
  head: {
    title() {
      return {
        inner: this.$t("view.artist_profile_creation.title"),
      };
    },
  },
  data() {
    return {
      completed: false,
      artist: {},
      loading: false,
      valid: false,
      validationErrors: {
        name: [],
        activeSince: [],
        mainGenre: [],
        avatar: [],
        city: [],
        country: [],
        about: [],
      },
      error: {},
    };
  },
  methods: {
    ...mapMutations(["SET_USER"]),
    createArtist() {
      this.loading = true;
      this.$http
        .post(`/api/artist`, this.artist)
        .then((response) => response.data)
        .then((data) => this.SET_USER(data))
        .then(() => (this.completed = true))
        .catch((err) => {
          if (err.response.status == 400)
            this.validationErrors = err.response.data;
          else this.$store.dispatch("ajaxError", err);
        })
        .then(() => {
          this.loading = false;
        });
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style></style>
