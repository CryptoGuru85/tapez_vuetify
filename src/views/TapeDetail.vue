<template>
  <div style="height: 100%;">
    <v-container fill-height v-if="tapeLocked">
      <v-row justify="center" align="center">
        <v-col cols="12" lg="7">
          <div class="text-center">
            <v-icon x-large>mdi-lock</v-icon>
          </div>
          <div class="text-h4 text-center">
            {{ $t("view.tape_detail.subtitle_tape_locked") }}
          </div>
        </v-col>
      </v-row>
    </v-container>
    <fetch-error v-else-if="fetchError" :error="fetchError"></fetch-error>
    <v-container v-else class="tape-detail">
      <v-row justify="center" v-if="tape.status == 2">
        <v-col xl="7" cols="12">
          <v-alert type="warning">{{
            $t("view.tape_detail.message_tape_processing")
          }}</v-alert>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="tape.locked">
        <v-col xl="7" cols="12">
          <v-alert type="warning">{{
            $t("view.tape_detail.message_tape_locked", {
              reason: tape.locks.slice(-1)[0].reason,
            })
          }}</v-alert>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col xl="3" lg="5" md="5" sm="6" cols="12">
          <v-skeleton-loader type="image" :loading="!tape.$state.loaded">
            <tape-cover :tape="tape"></tape-cover>
          </v-skeleton-loader>
          <v-skeleton-loader
            type="button, text@2"
            :loading="!tape.$state.loaded"
          >
            <v-btn
              :disabled="tape.$.status == 2"
              large
              color="primary"
              block
              class="mt-2 mb-2"
              :href="$apiURL(`/api/tape/${tape.$._id}/download`)"
              >{{ $t("view.tape_detail.action_download") }}</v-btn
            >
            <div class="d-flex justify-space-between">
              <tape-rating large hover :tape="tape.$"></tape-rating>
              <v-btn
                icon
                x-large
                text
                @click="forms.report.open = true"
                min-width="0"
                class="px-0"
                color="grey"
                ><v-icon large>mdi-flag</v-icon></v-btn
              >
            </div>
            <v-dialog v-model="forms.report.open" max-width="600">
              <v-card>
                <v-card-title>{{ $t("form.report.title") }}</v-card-title>
                <v-card-text>
                  <v-form v-model="forms.report.valid">
                    <report-form v-model="report" :tape="tape.$"></report-form>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="closeDialog('report')">{{
                    $t("view.tape_detail.action_discard_report")
                  }}</v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="sendReport"
                    :disabled="!forms.report.valid && !tape.$state.loading"
                  >
                    {{ $t("view.tape_detail.action_submit_report") }}</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <span class="mr-5 ml-3"
              ><v-icon>mdi-eye</v-icon> {{ tape.views }}</span
            >
            <span><v-icon>mdi-download</v-icon> {{ tape.downloads }}</span>
          </v-skeleton-loader>
        </v-col>
        <v-col xl="4" lg="7" md="7" sm="6" cols="12">
          <v-skeleton-loader
            type="heading, text@2, paragraph"
            :loading="!tape.$state.loaded"
          >
            <h1>
              {{ tape.$.title }}
              <v-btn
                v-if="$can('update', tape)"
                text
                @click="forms.meta.open = true"
                ><v-icon>mdi-pencil</v-icon>
                {{ $t("view.tape_detail.action_edit_meta") }}</v-btn
              >
            </h1>
            <v-dialog v-model="forms.meta.open" width="900">
              <v-card>
                <v-card-title primary-title>{{
                  $t("view.tape_detail.title_edit_tape")
                }}</v-card-title>
                <v-card-text
                  ><v-form
                    v-model="forms.meta.valid"
                    :disabled="tape.$state.saving"
                    class="mt-5"
                  >
                    <tape-metadata-form
                      v-model="tape"
                    ></tape-metadata-form></v-form
                ></v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="closeDialog('meta')">{{
                    $t("view.tape_detail.action_discard_tape_edit")
                  }}</v-btn>
                  <v-btn
                    color="primary"
                    text
                    @click="saveMeta()"
                    :disabled="!forms.meta.valid || tape.$state.saving"
                    >{{ $t("view.tape_detail.action_save_tape_edit") }}</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <h2 v-if="tape.$state.loaded">
              <router-link
                :to="{
                  name: 'artist-profile',
                  params: { id: tape.$.artist._id || '' },
                }"
                >{{ tape.$.artist.name }}</router-link
              >
            </h2>
            <p>
              <genre-chip small :genre="tape.$.genre"></genre-chip
              ><span v-if="tape.$.subgenre"> / {{ tape.$.subgenre }}</span>
            </p>
            <p class="tape-description">{{ tape.$.description }}</p>
          </v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col xl="7" cols="12">
          <h3>
            {{ $t("view.tape_detail.title_track_list") }}
            <v-btn
              v-if="$can('update', tape)"
              text
              @click="forms.tracks.open = true"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
          </h3>
        </v-col>
        <v-col xl="7" cols="12">
          <v-skeleton-loader
            type="list-item-avatar-three-line@10"
            :loading="!tape.$state.loaded"
          >
            <v-dialog v-model="forms.tracks.open" width="900">
              <v-card>
                <v-card-title primary-title>{{
                  $t("view.tape_detail.title_edit_tracks")
                }}</v-card-title>
                <v-card-text>
                  <v-form
                    v-model="forms.tracks.valid"
                    :disabled="tape.$state.loading"
                  >
                    <draggable-track-list
                      no-delete
                      hide-details
                      v-model="tape.tracks"
                    ></draggable-track-list>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="closeDialog('tracks')" text>{{
                    $t("view.tape_detail.action_discard_track_edit")
                  }}</v-btn>
                  <v-btn
                    color="primary"
                    text
                    :disabled="!forms.tracks.valid || tape.$state.loading"
                    @click="saveTracks"
                    >{{ $t("view.tape_detail.action_save_track_edit") }}</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <track-list :tape="tape.$"></track-list>
          </v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col xl="7" cols="12">
          <h3>
            {{
              $tc(
                "model.comment._name",
                tape.comments ? tape.comments.length : 0
              )
            }}
          </h3>
        </v-col>
        <v-col xl="7" cols="12" class="pt-0">
          <v-skeleton-loader
            type="list-item-avatar-three-line@10"
            :loading="!tape.$state.loaded"
          >
            <comment-list
              :comments="tape.$.comments"
              :to="`/api/tape/${this.$route.params.id}/comment`"
            ></comment-list>
          </v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-if="otherTapesByArtist.length"
          ><h3>
            {{ $t("view.tape_detail.label_other_tapes_by_this_artist") }}
          </h3></v-col
        >
      </v-row>
      <tape-card-row
        v-if="otherTapesByArtist.length"
        :tapes="otherTapesByArtist.docs"
      ></tape-card-row>
      <v-snackbar v-model="snackbar.visible" :color="snackbar.color">{{
        snackbar.text
      }}</v-snackbar>
    </v-container>
  </div>
</template>

<script>
import fetchError from "@/mixins/fetchError";
import TapeCardRow from "@/components/TapeCardRow.vue";
import CommentList from "@/components/CommentList.vue";
import TapeRating from "@/components/TapeRating.vue";
import TrackList from "@/components/TrackList.vue";
import GenreChip from "@/components/GenreChip.vue";
import TapeMetadataForm from "@/forms/TapeMetadata.vue";
import ReportForm from "@/forms/Report.vue";
import DraggableTrackList from "@/components/DraggableTrackList.vue";
import TapeCover from "@/components/TapeCover.vue";
import Tape from "./../service/Tape";
import Report from "./../service/Report";

export default {
  components: {
    TapeCardRow,
    CommentList,
    TapeRating,
    TrackList,
    GenreChip,
    TapeMetadataForm,
    DraggableTrackList,
    TapeCover,
    ReportForm,
  },
  mixins: [fetchError],
  head: {
    title() {
      return {
        inner: this.tape.$state.loaded
          ? `${this.tape.title} - ${this.tape.artist.name}`
          : this.$t("view.tape_detail.title"),
      };
    },
  },
  data() {
    return {
      snackbar: {
        visible: false,
        color: "success",
        text: "",
      },
      tape: new Tape(),
      track: {},
      otherTapesByArtist: {},
      report: new Report(),
      tapeLocked: false,
      forms: {
        meta: {
          open: false,
          valid: false,
        },
        tracks: {
          open: false,
          valid: false,
        },
        report: {
          open: false,
          valid: false,
        },
      },
    };
  },
  async mounted() {
    try {
      await this.tape.get(this.$route.params.id, {
        silent: false,
        showSnackbar: false,
      });
      this.$emit("updateHead");
      this.otherTapesByArtist = await this.tape.getOtherTapesByArtist();
    } catch (err) {
      if (err.response && err.response.status == 403) this.tapeLocked = true;
      else this.setFetchError(err);
    }
  },
  methods: {
    async saveMeta() {
      await this.tape.save();
      this.forms.meta.open = false;
    },
    saveTracks() {
      this.forms.tracks.loading = true;
      this.$http
        .patch(`/api/tape/${this.tape._id}/tracks`, {
          tracks: this.tape.tracks,
        })
        .then((response) => response.data)
        .then((tape) => this.tape.set(tape))
        .catch(() => {})
        .then(() => {
          this.forms.tracks.loading = false;
          this.forms.tracks.open = false;
        })
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
        });
    },
    resetEditable() {
      this.tape.discard();
      this.report = new Report();
    },
    closeDialog(name) {
      if (!this.forms[name]) return;
      this.forms[name].open = false;
      this.resetEditable();
    },
    showSnackbar(text, color = "success") {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },
    async sendReport() {
      await this.tape.report(this.report);
      this.closeDialog("report");
      this.resetEditable();
    },
  },
};
</script>

<style scoped>
.tape-description {
  white-space: pre-wrap;
}
</style>
