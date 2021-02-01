<template>
  <div>
    <fetch-error v-if="fetchError" :error="fetchError"></fetch-error>
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="12" xl="7" lg="10" md="12">
          <v-card>
            <v-hover v-slot:default="{ hover }">
              <v-img
                :aspect-ratio="6 / 1"
                :src="bannerUrl"
                class="pa-5 user-banner"
              >
                <v-btn
                  class="topright-edit-button"
                  v-if="$can('update', artist) && hover"
                  @click="forms.banner.open = true"
                >
                  <v-icon>mdi-pencil</v-icon></v-btn
                >
                <template v-slot:placeholder>
                  <div class="lightbox fill-height"></div>
                </template>
                <v-dialog max-width="1030" v-model="forms.banner.open">
                  <v-card>
                    <v-card-title>{{
                      $t("view.artist_profile.title_banner_upload")
                    }}</v-card-title>
                    <v-card-text>
                      <image-uploader
                        accept="image/*"
                        :placeholder-font-size="16"
                        ref="bannerUploader"
                        :width="1018"
                        :height="202"
                      ></image-uploader>
                    </v-card-text>
                    <v-card-actions
                      ><v-spacer></v-spacer>
                      <v-btn text @click="forms.banner.open = false">
                        {{ $t("view.artist_profile.action_discard_banner") }}
                      </v-btn>

                      <v-btn
                        color="primary"
                        @click="uploadBanner"
                        text
                        :disabled="forms.banner.loading"
                        >{{
                          $t("view.artist_profile.action_upload_banner")
                        }}</v-btn
                      ></v-card-actions
                    >
                  </v-card>
                </v-dialog>
                <div
                  class="banner-inner d-flex justify-space-between align-end"
                >
                  <div>
                    <v-hover v-slot:default="{ hover }">
                      <div style="position: relative;">
                        <user-avatar
                          tile
                          size="128"
                          :user="artist"
                        ></user-avatar>
                        <v-btn
                          class="topright-edit-button"
                          v-if="$can('update', artist) && hover"
                          @click="forms.avatar.open = true"
                          ><v-icon>mdi-pencil</v-icon></v-btn
                        >
                      </div>
                    </v-hover>
                    <v-dialog max-width="400" v-model="forms.avatar.open">
                      <v-card>
                        <v-card-title>{{
                          $t("view.artist_profile.title_avatar_upload")
                        }}</v-card-title>
                        <v-card-text>
                          <image-uploader
                            accept="image/*"
                            :placeholder-font-size="16"
                            ref="avatarUploader"
                            :width="256"
                            :height="256"
                          ></image-uploader>
                        </v-card-text>
                        <v-card-actions
                          ><v-spacer></v-spacer>
                          <v-btn text @click="forms.avatar.open = false">{{
                            $t("view.artist_profile.action_discard_avatar")
                          }}</v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="uploadAvatar"
                            :disabled="forms.avatar.loading"
                            >{{
                              $t("view.artist_profile.action_save_avatar")
                            }}</v-btn
                          ></v-card-actions
                        >
                      </v-card>
                    </v-dialog>
                    <div class="white--text headline artist-name">
                      {{ artist.name }}
                    </div>
                  </div>
                  <div class="social-media-links">
                    <a
                      v-if="artist.socialMedia && artist.socialMedia.facebook"
                      class="mx-1"
                      :href="`https://www.facebook.com/${artist.socialMedia.facebook}`"
                      ><v-icon>mdi-facebook</v-icon></a
                    >
                    <a
                      v-if="artist.socialMedia && artist.socialMedia.twitter"
                      class="mx-1"
                      :href="`https://www.twitter.com/${artist.socialMedia.twitter}`"
                      target="_blank"
                      ><v-icon>mdi-twitter</v-icon></a
                    >
                    <a
                      v-if="artist.socialMedia && artist.socialMedia.soundcloud"
                      class="mx-1"
                      :href="`https://soundcloud.com/${artist.socialMedia.soudcloud}`"
                      ><v-icon>mdi-soundcloud</v-icon></a
                    >
                    <a
                      v-if="artist.socialMedia && artist.socialMedia.instagram"
                      class="mx-1"
                      :href="`https://www.instagram.com/${artist.socialMedia.instagram}`"
                      ><v-icon>mdi-instagram</v-icon></a
                    >
                    <a
                      v-if="artist.socialMedia && artist.socialMedia.homepage"
                      class="mx-1"
                      :href="artist.socialMedia.homepage"
                      ><v-icon>mdi-earth</v-icon></a
                    >
                  </div>
                </div>
              </v-img>
            </v-hover>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" xl="3" lg="5" md="6">
          <v-card>
            <v-hover v-slot:default="{ hover }">
              <div>
                <v-card-title>{{
                  $t("view.artist_profile.title_artist_detail")
                }}</v-card-title>
                <v-btn
                  class="topright-edit-button mt-3 mr-3"
                  v-show="$can('update', artist) && hover"
                  @click="forms.profile.open = true"
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
                <v-list class="profile-info">
                  <v-list-item two-line v-if="artist.activeSince">
                    <v-list-item-content>
                      <v-list-item-subtitle>{{
                        $t("view.artist_profile.label_active_since")
                      }}</v-list-item-subtitle>
                      <v-list-item-title>{{
                        artist.activeSince
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line v-if="artist.country">
                    <v-list-item-content>
                      <v-list-item-subtitle>{{
                        $t("view.artist_profile.label_active_origin")
                      }}</v-list-item-subtitle>
                      <v-list-item-title v-if="artist.city">{{
                        $t("view.artist_profile.text_origin_format_with_city", {
                          city: artist.city,
                          country: artist.country,
                        })
                      }}</v-list-item-title>
                      <v-list-item-title v-else>{{
                        artist.country
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line v-if="artist.mainGenre">
                    <v-list-item-content>
                      <v-list-item-subtitle>{{
                        $tc("view.artist_profile.label_main_genre", 1)
                      }}</v-list-item-subtitle>
                      <v-list-item-title
                        ><genre-chip :genre="artist.mainGenre"></genre-chip
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="artist.about">
                    <v-list-item-content>
                      <v-list-item-subtitle>{{
                        $t("view.artist_profile.label_about")
                      }}</v-list-item-subtitle>
                      <p>
                        {{ artist.about }}
                      </p>
                    </v-list-item-content>
                  </v-list-item>
                  <v-dialog max-width="900" v-model="forms.profile.open">
                    <v-card>
                      <v-card-title primary-title>{{
                        $t("view.artist_profile.title_edit_profile")
                      }}</v-card-title>
                      <v-card-text
                        ><v-form
                          v-model="forms.profile.valid"
                          :disabled="forms.profile.loading"
                        >
                          <artist-profile-form
                            v-model="editableArtist"
                          ></artist-profile-form></v-form
                      ></v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="closeDialog('profile')" text>{{
                          $t("view.artist_profile.action_cancel_edit")
                        }}</v-btn>
                        <v-btn
                          color="primary"
                          text
                          @click="saveProfile"
                          :disabled="
                            !forms.profile.valid || forms.profile.loading
                          "
                          >{{
                            $t("view.artist_profile.action_save_profile")
                          }}</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-list>
              </div>
            </v-hover>
          </v-card>
        </v-col>
        <v-col cols="12" xl="4" lg="5" md="6">
          <v-card>
            <v-card-title>{{
              $t("view.artist_profile.title_discography")
            }}</v-card-title>
          </v-card>
          <tape-timeline :tapes="tapes"></tape-timeline>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TapeTimeline from "../components/TapeTimeline.vue";
import UserAvatar from "./../components/UserAvatar.vue";
import ArtistProfileForm from "@/forms/ArtistProfile.vue";
import GenreChip from "@/components/GenreChip.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import fetchError from "@/mixins/fetchError";

import { mapMutations } from "vuex";

export default {
  components: {
    TapeTimeline,
    UserAvatar,
    ArtistProfileForm,
    GenreChip,
    ImageUploader,
  },
  mixins: [fetchError],
  head: {
    title() {
      return {
        inner: this.artist.name || this.$t("view.artist_profile.title"),
      };
    },
  },
  mounted() {
    this.fetchError = null;
    this.$http
      .get(`/api/artist/${this.$route.params.id}`)
      .then((result) => result.data)
      .then((data) => {
        this.artist = data;
        this.resetEditable();
        this.requestLoaded = true;

        this.$emit("updateHead");
      })
      .catch(this.setFetchError);
    this.loadTapes();
  },
  data() {
    return {
      artist: {},
      editableArtist: {},
      dataLoaded: false,
      requestLoaded: false,
      forms: {
        profile: {
          open: false,
          valid: false,
          loading: false,
        },
        banner: {
          open: false,
          valid: false,
          loading: false,
        },
        avatar: {
          open: false,
          valid: false,
          loading: false,
        },
      },
      tapes: [],
    };
  },
  methods: {
    ...mapMutations(["UPDATE_ARTIST"]),
    saveProfile() {
      this.forms.profile.loading = true;
      this.$http
        .patch(`/api/artist/${this.artist._id}`, this.editableArtist)
        .then((response) => response.data)
        .then((artist) => {
          this.artist = artist;
          this.UPDATE_ARTIST(artist);
          this.resetEditable();
          this.forms.profile.loading = false;
          this.forms.profile.open = false;
        })
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
          this.forms.profile.loading = false;
        });
    },
    uploadBanner() {
      const body = new FormData();
      this.forms.banner.loading = true;
      this.$refs.bannerUploader.getBlob().then((banner) => {
        body.append("banner", banner);
        this.$http
          .patch(`/api/artist/${this.artist._id}`, body, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((result) => result.data)
          .then((artist) => {
            this.artist = artist;
            this.UPDATE_ARTIST(artist);
            this.forms.banner.loading = false;
            this.forms.banner.open = false;
          })
          .catch((err) => {
            this.$store.dispatch("ajaxError", err);
            this.forms.banner.loading = false;
          });
      });
    },
    uploadAvatar() {
      const body = new FormData();
      this.forms.avatar.loading = true;
      this.$refs.avatarUploader.getBlob().then((avatar) => {
        body.append("avatar", avatar);
        this.$http
          .patch(`/api/artist/${this.artist._id}`, body, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((result) => result.data)
          .then((artist) => {
            this.artist = artist;
            this.UPDATE_ARTIST(artist);
            this.forms.avatar.loading = false;
            this.forms.avatar.open = false;
          })
          .catch((err) => {
            this.$store.dispatch("ajaxError", err);
            this.forms.avatar.loading = false;
          });
      });
    },
    resetEditable() {
      this.editableArtist = JSON.parse(JSON.stringify(this.artist));
      return true;
    },
    closeDialog(name) {
      if (!this.forms[name]) return;
      this.forms[name].open = false;
      this.resetEditable();
    },
    loadTapes() {
      this.$http
        .get(
          this.$apiURL("api/tape", [
            ["artist", this.$route.params.id],
            ["sort", "-year"],
          ])
        )
        .then((data) => data.data.docs)
        .then((tapes) => (this.tapes = tapes))
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
        });
    },
  },
  computed: {
    bannerUrl() {
      return this.$apiURL(`/api/resource/static/avatars/${this.artist.banner}`);
    },
  },
  watch: {
    artist() {
      this.resetEditable();
    },
  },
};
</script>

<style scoped>
.banner-inner {
  width: 100%;
  height: 100%;
}
.social-media-links a {
  text-decoration: none;
}
.profile-info {
  position: relative;
}
.topright-edit-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
.lightbox {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 72px
  );
}
.artist-name {
  text-shadow: 2px 2px 5px black;
}
</style>
