<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="7" lg="6">
        <h1 class="text-center">{{ $t("view.user_info.title") }}</h1>
        <v-card>
          <v-card-title>{{
            $t("view.user_info.title_user_profile")
          }}</v-card-title>
          <v-card-subtitle>{{
            $t("view.user_info.subtitle_user_profile")
          }}</v-card-subtitle>
          <v-list>
            <v-dialog width="500" v-model="dialogStates.avatar">
              <template v-slot:activator="{ on }">
                <v-list-item link v-on="on">
                  <v-row dense align="center">
                    <v-col cols="4" class="text-body-2 text-uppercase">
                      {{ $tc("view.user_info.title_user_avatar") }}
                    </v-col>
                    <v-col class="text-body-2 text--secondary">
                      {{ $t("view.user_info.subtitle_user_avatar") }}
                    </v-col>
                    <v-col cols="auto">
                      <user-avatar :user="user"></user-avatar>
                    </v-col>
                  </v-row>
                </v-list-item>
              </template>
              <v-card>
                <v-card-title>{{
                  $tc("view.user_info.title_user_avatar", 1)
                }}</v-card-title>
                <v-card-text class="mt-5">
                  <image-uploader
                    accept="image/*"
                    :placeholder-font-size="16"
                    ref="avatarUploader"
                    :width="256"
                    :height="256"
                  ></image-uploader>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogStates.avatar = false">{{
                    $t("view.user_avatar_action_discard_avatar")
                  }}</v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="saveAvatar"
                    :disabled="loadingStates.avatar"
                    >{{ $t("view.user_avatar_action_save_avatar") }}</v-btn
                  ></v-card-actions
                >
              </v-card>
            </v-dialog>

            <v-divider></v-divider>
            <v-dialog width="500" v-model="dialogStates.name">
              <template v-slot:activator="{ on }">
                <v-list-item link v-on="on">
                  <v-row dense align="center">
                    <v-col cols="4" class="text-body-2 text-uppercase">
                      {{ $t("view.user_info.title_name") }}
                    </v-col>
                    <v-col class="text-body">
                      {{ user.firstname + " " + user.lastname }}
                    </v-col>
                    <v-list-item-action>
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-action>
                  </v-row>
                </v-list-item>
              </template>
              <v-card>
                <v-form :disabled="loadingStates.name">
                  <v-card-title primary-title>{{
                    $t("view.user_info.title_name")
                  }}</v-card-title>
                  <v-card-text>
                    <v-container class="pb-0">
                      <v-row dense>
                        <v-col cols="12">
                          <v-text-field
                            :label="$tc('model.user.firstname', 1)"
                            v-model="formData.firstname"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            :label="$tc('model.user.lastname', 1)"
                            v-model="formData.lastname"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialogStates.name = false">{{
                      $t("view.user_info.action_discard_name")
                    }}</v-btn
                    ><v-btn text color="primary" @click="saveName">{{
                      $t("view.user_info.action_save_name")
                    }}</v-btn></v-card-actions
                  >
                </v-form>
              </v-card>
            </v-dialog>

            <v-divider></v-divider>
            <v-dialog width="500" v-model="dialogStates.email">
              <template v-slot:activator="{ on }">
                <v-list-item link v-on="on">
                  <v-row dense align="center">
                    <v-col cols="4" class="text-body-2 text-uppercase">
                      {{ $t("view.user_info.title_email") }}
                    </v-col>
                    <v-col class="text-body">
                      {{ user.email }}
                    </v-col>
                    <v-list-item-action>
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-action>
                  </v-row>
                </v-list-item>
              </template>
              <v-card>
                <v-card-title primary-title>{{
                  $t("view.user_info.title_email")
                }}</v-card-title>
                <v-card-text class="mt-5">
                  <v-text-field
                    type="email"
                    v-model="formData.email"
                    :label="$tc('model.user.email', 1)"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogStates.email = false">{{
                    $t("view.user_info.action_discard_email")
                  }}</v-btn
                  ><v-btn text color="primary" @click="saveEmail">{{
                    $t("view.user_info.action_save_email")
                  }}</v-btn></v-card-actions
                >
              </v-card>
            </v-dialog>
            <v-divider></v-divider>
            <v-dialog width="500" v-model="dialogStates.password">
              <template v-slot:activator="{ on }">
                <v-list-item link v-on="on">
                  <v-row dense align="center">
                    <v-col cols="4" class="text-body-2 text-uppercase">
                      {{ $t("view.user_info.title_password") }}
                    </v-col>
                    <v-col class="text-body">
                      ••••••••
                    </v-col>
                    <v-list-item-action>
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-action>
                  </v-row>
                </v-list-item>
              </template>
              <v-card>
                <v-card-title primary-title>{{
                  $t("view.user_info.title_password")
                }}</v-card-title>
                <v-card-text class="mt-5">
                  <v-text-field
                    type="password"
                    v-model="formData.password"
                    :label="$tc('model.user.password', 1)"
                  ></v-text-field>
                  <v-text-field
                    type="password"
                    v-model="formData.passwordRepeat"
                    :label="$t('view.user_info.label_repeat_password')"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogStates.password = false">{{
                    $t("view.user_info.action_discard_password")
                  }}</v-btn
                  ><v-btn text color="primary" @click="savePassword">{{
                    $t("view.user_info.action_save_password")
                  }}</v-btn></v-card-actions
                >
              </v-card>
            </v-dialog>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import UserAvatar from "@/components/UserAvatar.vue";
import ImageUploader from "@/components/ImageUploader.vue";

export default {
  components: {
    UserAvatar,
    ImageUploader,
  },
  computed: {
    ...mapState(["user"]),
  },
  head: {
    title() {
      return {
        inner: this.$t("view.user_info.title"),
      };
    },
  },
  data() {
    return {
      formData: {
        firstname: "",
        lastname: "",
        password: "",
        passwordRepeat: "",
        oldPassword: "",
        avatar: {},
      },
      loadingStates: {
        name: false,
        avatar: false,
        password: false,
        email: false,
      },
      dialogStates: {
        name: false,
        avatar: false,
        password: false,
        email: false,
      },
    };
  },
  methods: {
    ...mapMutations(["SET_USER"]),
    saveName() {
      this.loadingStates.name = true;
      let body = {
        firstname: this.formData.firstname,
        lastname: this.formData.lastname,
      };
      this.$http
        .patch(`/api/user/${this.user._id}`, body)
        .then((result) => result.data)
        .then((data) => this.SET_USER(data))
        .then(() => {
          this.dialogStates.name = false;
        })
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
        })
        .then(() => {
          this.loadingStates.name = false;
        });
    },
    saveAvatar() {
      const body = new FormData();
      this.loadingStates.avatar = true;
      this.$refs.avatarUploader.getBlob().then((avatar) => {
        body.append("avatar", avatar);
        this.$http
          .patch(`/api/user/${this.user._id}`, body, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((result) => result.data)
          .then((data) => this.SET_USER(data))
          .then(() => {
            this.dialogStates.avatar = false;
          })
          .catch((err) => {
            this.$store.dispatch("ajaxError", err);
          })
          .then(() => {
            this.loadingStates.avatar = false;
          });
      });
    },
    savePassword() {
      this.loadingStates.password = true;
      let body = {
        oldPassword: this.formData.oldPassword,
        password: this.formData.password,
        passwordRepeat: this.formData.passwordRepeat,
      };
      this.$http
        .patch(`/api/user/${this.user._id}`, body)
        .then((result) => result.data)
        .then((data) => this.SET_USER(data))
        .then(() => {
          this.dialogStates.password = false;
        })
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
        })
        .then(() => {
          this.loadingStates.password = false;
        });
    },
    saveEmail() {
      this.loadingStates.email = true;
      let body = {
        email: this.formData.email,
      };
      this.$http
        .patch(`/api/user/${this.user._id}`, body)
        .then((result) => result.data)
        .then((data) => this.SET_USER(data))
        .then(() => {
          this.dialogStates.email = false;
        })
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
        })
        .then(() => {
          this.loadingStates.email = false;
        });
    },
  },
  mounted() {
    this.formData.firstname = this.user.firstname;
    this.formData.lastname = this.user.lastname;
  },
};
</script>

<style></style>
