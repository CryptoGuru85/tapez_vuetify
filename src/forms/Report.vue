<template>
  <v-row>
    <v-col cols="12">
      <v-radio-group
        :value="value.reason"
        :label="$t('form.report.title_reason')"
        @change="
          $emit('input', {
            ...value,
            reason: $event,
          })
        "
        mandatory
      >
        <v-radio :value="1">
          <template v-slot:label>
            <span
              >{{ $t("form.report.text_reasons.COPYRIGHT_MATERIAL") }}
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" class="ml-1">
                    <v-icon small>mdi-help-circle-outline</v-icon>
                  </span>
                </template>
                <span>{{
                  $tc("form.report.tooltip_reasons.COPYRIGHT_MATERIAL", 1)
                }}</span>
              </v-tooltip>
            </span>
          </template>
        </v-radio>
        <v-radio :value="2">
          <template v-slot:label>
            <span
              >{{ $tc("form.report.text_reasons.COPYRIGHT_CLAIM", 2) }}
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" class="ml-1">
                    <v-icon small>mdi-help-circle-outline</v-icon>
                  </span>
                </template>
                <span>{{
                  $tc("form.report.tooltip_reasons.COPYRIGHT_CLAIM", 2)
                }}</span>
              </v-tooltip>
            </span>
          </template>
        </v-radio>
        <v-radio :value="3">
          <template v-slot:label>
            <span
              >{{ $tc("form.report.text_reasons.HATE_SPEECH", 3) }}
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" class="ml-1">
                    <v-icon small>mdi-help-circle-outline</v-icon>
                  </span>
                </template>
                <span>{{
                  $tc("form.report.tooltip_reasons.HATE_SPEECH", 3)
                }}</span>
              </v-tooltip>
            </span>
          </template>
        </v-radio>
        <v-radio :value="4">
          <template v-slot:label>
            <span
              >{{ $tc("form.report.text_reasons.INAPPROPRIATE_CONTENT", 4) }}
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" class="ml-1">
                    <v-icon small>mdi-help-circle-outline</v-icon>
                  </span>
                </template>
                <span>{{
                  $tc("form.report.tooltip_reasons.INAPPROPRIATE_CONTENT", 4)
                }}</span>
              </v-tooltip>
            </span>
          </template>
        </v-radio>
        <v-radio :value="5">
          <template v-slot:label>
            <span
              >{{ $tc("form.report.text_reasons.SPAM", 5) }}
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" class="ml-1">
                    <v-icon small>mdi-help-circle-outline</v-icon>
                  </span>
                </template>
                <span>{{ $tc("form.report.tooltip_reasons.SPAM", 5) }}</span>
              </v-tooltip>
            </span>
          </template>
        </v-radio>
        <v-radio :value="6">
          <template v-slot:label>
            <span
              >{{ $tc("form.report.text_reasons.OTHER", 6) }}
              <v-tooltip bottom max-width="300">
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" class="ml-1">
                    <v-icon small>mdi-help-circle-outline</v-icon>
                  </span>
                </template>
                <span>{{ $tc("form.report.tooltip_reasons.OTHER", 6) }}</span>
              </v-tooltip>
            </span>
          </template>
        </v-radio>
      </v-radio-group>
      <v-select
        :label="$t('model.tape.tracks')"
        multiple
        :items="tracks"
        item-text="title"
        item-value="_id"
        @input="
          $emit('input', {
            ...value,
            tracks: $event,
          })
        "
      ></v-select>
      <v-textarea
        :label="$t('model.report.reason._name') + '*'"
        :value="value.description"
        :rules="[
          commonRules.required,
          commonRules.minChars(10),
          commonRules.maxChars(1000),
        ]"
        @input="$emit('input', { ...value, description: $event })"
      ></v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import commonRules from "../mixins/CommonRules";

export default {
  props: ["value", "errors", "tape"],
  mixins: [commonRules],
  computed: {
    tracks() {
      return this.tape && this.tape.tracks ? this.tape.tracks : [];
    },
  },
};
</script>

<style></style>
