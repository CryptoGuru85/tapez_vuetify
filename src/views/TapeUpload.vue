<template>
  <div class="h-100">
    <v-container fill-height fluid v-if="!userHasArtistProfiles">
      <v-row align="center" justify="center">
        <v-col cols="12" md="7" class="text-center">
          <div class="text-h3">
            {{ $t("view.tape_upload.title_no_artist_profile_yet") }}
          </div>
          <div class="text-h5">
            {{ $t("view.tape_upload.subtitle_no_artist_profile_yet") }}
          </div>
          <v-btn
            x-large
            color="primary"
            class="mt-2"
            :to="{
              name: 'artist-profile-creation',
              query: { redirect: $router.currentRoute.fullPath },
            }"
            >{{ $t("view.tape_upload.action_create_artist_profile") }}</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <v-container fill-height v-else-if="uploading">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            :size="100"
            :width="10"
            :value="uploadProgress"
            color="primary"
          >
            {{ uploadProgress }}%
          </v-progress-circular>
          <p class="mt-2">{{ $t("view.tape_upload.text_upload_progress") }}</p>
        </v-col>
      </v-row>
    </v-container>
    <v-container fill-height v-else-if="apiError">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <div class="text-h3">
            {{ $t("view.tape_upload.title_upload_api_error") }}
          </div>
          <div class="text-h5">
            {{ $t("view.tape_upload.subtitle_upload_api_error") }}
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <v-alert type="error">{{ apiError.message }}</v-alert>
          <div class="text-center">
            <v-btn color="primary" @click="reset">{{
              $t("view.tape_upload.action_try_again")
            }}</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step :complete="step > 1" step="1">{{
                $t("view.tape_upload.label_step1_stepper")
              }}</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 2" step="2">{{
                $t("view.tape_upload.label_step2_stepper")
              }}</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 3" step="3">{{
                $t("view.tape_upload.label_step3_stepper")
              }}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card>
                  <v-card-title>{{
                    $t("view.tape_upload.title_step1")
                  }}</v-card-title>
                  <v-card-subtitle>{{
                    $t("view.tape_upload.subtitle_step1")
                  }}</v-card-subtitle>
                  <v-card-text>
                    <v-form v-model="validStates.step1">
                      <tape-metadata-form
                        v-model="tape"
                        return-genre-object
                        create
                        outlined
                      ></tape-metadata-form>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      @click="step = 2"
                      :disabled="!validStates.step1"
                      >{{ $t("view.tape_upload.action_goto_step_2") }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-card>
                  <v-card-title>{{
                    $t("view.tape_upload.title_step2")
                  }}</v-card-title>
                  <v-card-subtitle>{{
                    $t("view.tape_upload.subtitle_step2")
                  }}</v-card-subtitle>
                  <v-card-text>
                    <v-form v-model="validStates.step2">
                      <v-responsive
                        :aspect-ratio="4 / 2"
                        :class="
                          'd-flex align-center justify-center dropzone ' +
                          (isDragover ? 'dragover' : '')
                        "
                        @drop.prevent="addTracksFromDropZone"
                        @dragover.prevent="isDragover = true"
                        @dragleave.prevent="isDragover = false"
                        v-cloak
                      >
                        <div
                          class="drop-text text-h5 text-center"
                          v-if="tracks.length == 0"
                        >
                          {{
                            $t("view.tape_upload.text_dropzone_drop_files_here")
                          }}
                        </div>
                        <draggable-track-list
                          v-model="tracks"
                          disable-rules
                        ></draggable-track-list>
                      </v-responsive>
                      <v-divider class="my-5"></v-divider>
                      <v-btn
                        @click="openFileSelector"
                        block
                        text
                        color="primary"
                        x-large
                        >{{ $t("view.tape_upload.action_add_files") }}</v-btn
                      >
                      <input
                        type="file"
                        multiple
                        ref="fileInput"
                        accept="audio/mpeg,audio/ogg/audio/wav"
                        class="d-none"
                        @change="addTracksFromFileInput"
                      />
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn type="text" @click="step = 1">{{
                      $t("view.tape_upload.action_backto_step_1")
                    }}</v-btn>
                    <v-btn
                      color="primary"
                      @click="step = 3"
                      :disabled="
                        !validStates.step2 || !tracks || !(tracks.length > 0)
                      "
                      >{{ $t("view.tape_upload.action_goto_step_3") }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-card>
                  <v-card-title>{{
                    $t("view.tape_upload.title_step3")
                  }}</v-card-title>
                  <v-card-subtitle>{{
                    $t("view.tape_upload.subtitle_step3")
                  }}</v-card-subtitle>
                  <v-row class="mx-1">
                    <v-col cols="4">
                      <v-img :aspect-ratio="1" :src="coverObjectUrl"></v-img>
                    </v-col>
                    <v-col cols="8">
                      <h1>{{ tape.title }}</h1>
                      <h2>{{ tape.artist.name }}</h2>
                      <p>
                        {{ tape.year }} /
                        <genre-chip
                          :link="false"
                          small
                          :genre="tape.genre"
                          v-if="tape.genre"
                        ></genre-chip
                        ><span v-if="tape.subgenre">
                          / {{ tape.subgenre }}</span
                        >
                      </p>
                      <h5>{{ $t("model.tape.description") }}</h5>
                      <p class="description">{{ tape.description }}</p>
                    </v-col>
                    <v-col cols="12">
                      <h5>{{ $t("model.tape.tracks") }}</h5>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Player</th>
                              <th width="90%">
                                {{ $tc("model.track._name", 2) }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(track, i) in tracks" :key="i">
                              <td>{{ i + 1 }}</td>
                              <td>
                                <v-btn
                                  text
                                  small
                                  dense
                                  color="gray"
                                  v-if="!track.playing"
                                  @click="playTrack(track)"
                                  ><v-icon>mdi-play</v-icon></v-btn
                                >
                                <v-btn
                                  text
                                  small
                                  dense
                                  color="gray"
                                  v-else
                                  @click="pauseTrack(track)"
                                  ><v-icon>mdi-pause</v-icon></v-btn
                                >
                              </td>
                              <td>{{ track.title || track.file.name }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn type="text" @click="step = 2">{{
                      $t("view.tape_upload.action_backto_step_2")
                    }}</v-btn>
                    <v-btn
                      color="primary"
                      @click="upload"
                      :disabled="!validStates.step3"
                      >{{ $t("view.tape_upload.action_upload") }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DraggableTrackList from "@/components/DraggableTrackList.vue";
import GenreChip from "@/components/GenreChip.vue";
import TapeMetadataForm from "@/forms/TapeMetadata";

export default {
  components: {
    DraggableTrackList,
    GenreChip,
    TapeMetadataForm,
  },
  computed: {
    ...mapGetters(["userHasArtistProfiles", "availableAliases"]),
    ...mapState(["user"]),
    coverObjectUrl() {
      return this.tape.cover instanceof File
        ? URL.createObjectURL(this.tape.cover)
        : "";
    },
  },
  head: {
    title() {
      return {
        inner: this.$t("view.tape_upload.title"),
      };
    },
  },
  data() {
    return {
      isDragover: false,
      step: 1,
      tracks: [],
      files: [],
      tape: {
        title: "",
        artist: {
          name: "unknown",
          _id: "0",
        },
        year: new Date().getFullYear(),
        genre: undefined,
        subgenre: "",
        cover: null,
        backcover: null,
        description: "",
      },
      uploading: false,
      uploadProgress: 0,
      apiError: null,
      validStates: {
        step1: false,
        step2: false,
        step3: true,
      },
    };
  },
  methods: {
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    addTracksFromDropZone(e) {
      const droppedFiles = e.dataTransfer.files;
      if (!droppedFiles) return;
      [...droppedFiles]
        .filter((file) =>
          ["audio/mpeg", "audio/wav", "audio/ogg"].includes(file.type)
        )
        .forEach((f) => {
          this.tracks.push({
            file: f,
            playing: false,
          });
          this.files.push(f);
        });
      this.isDragover = false;
    },
    addTracksFromFileInput(e) {
      e.target.files.forEach((f) => {
        this.tracks.push({
          file: f,
          playing: false,
          audio: null,
        });
      });
    },
    upload() {
      const formData = new FormData();
      this.tracks.forEach((track) => {
        formData.append("track_files[]", track.file);
        formData.append(
          "track_names[]",
          track.title || track.file.name.split(".").slice(0, -1).join(".")
        );
      });
      formData.append("cover", this.tape.cover);
      formData.append("title", this.tape.title);
      formData.append("artist", this.tape.artist._id);
      formData.append("year", Number(this.tape.year));
      formData.append("genre", this.tape.genre._id);
      formData.append("subgenre", this.tape.subgenre);
      formData.append("description", this.tape.description);

      this.uploading = true;
      this.$http
        .post(`/api/tape`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e) => {
            this.uploadProgress = Math.round((e.loaded * 100) / e.total);
          },
        })
        .then((response) => response.data)
        .then((data) => {
          this.$router.push({
            name: "tape-detail",
            params: { id: data.alias },
          });
        })
        .catch((err) => {
          this.uploading = false;
          this.apiError = err.response
            ? err.response
            : { message: err.message };
        });
    },
    reset() {
      this.step = 1;
      this.apiError = null;
    },
    playTrack(track) {
      this.tracks.forEach((t) => {
        if (t.playing) t.audio.pause();
        t.playing = false;
      });
      if (!track.audio) {
        const url = URL.createObjectURL(track.file);
        track.audio = new Audio(url);
      }
      track.audio.play();
      track.playing = true;
    },
    pauseTrack(track) {
      if (track.audio) track.audio.pause();
      track.playing = false;
    },
  },
  created() {
    this.tape.user = this.user;
    this.tape.artist = this.user.artists[0];
  },
};
</script>

<style scoped lang="scss">
@import "~vuetify/src/styles/styles.sass";

.dropzone {
  border: 2px dashed lightgray;
  border-radius: 10px;
}
.dragover {
  border-color: map-get($blue, base);
}
.dropzone .drop-text {
  cursor: default;
}
.description {
  white-space: pre-wrap;
}
.h-100 {
  height: 100%;
}
</style>
