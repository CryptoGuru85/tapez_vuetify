<template>
  <div>
    <div class="d-flex justify-center">
      <croppa
        prevent-white-space
        :accept="accept"
        :show-remove-button="false"
        :placeholder="$t('component.image_uploader.text_dropzone_placeholder')"
        v-model="croppa"
        v-bind="$attrs"
      ></croppa>
    </div>
    <div class="d-flex justify-center mt-2">
      <v-btn-toggle v-model="noSelection" multiple @change="noSelection = []">
        <v-btn @click="croppa.rotate(-1)"
          ><v-icon>mdi-rotate-left</v-icon></v-btn
        >
        <v-btn @click="croppa.rotate(1)"
          ><v-icon>mdi-rotate-right</v-icon></v-btn
        >
        <v-btn @click="croppa.zoomIn()"><v-icon>mdi-plus</v-icon></v-btn>
        <v-btn @click="croppa.zoomOut()"><v-icon>mdi-minus</v-icon></v-btn>
        <v-btn @click="croppa.chooseFile()"
          ><v-icon>mdi-folder-open</v-icon></v-btn
        >
        <v-btn @click="croppa.remove()"><v-icon>mdi-delete</v-icon></v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: () => "image/*",
    },
  },
  data() {
    return {
      croppa: {},
      noSelection: undefined,
    };
  },
  methods: {
    getBlob() {
      return new Promise((resolve) => {
        this.croppa.generateBlob((blob) => {
          resolve(blob);
        });
      });
    },
    getDataUrl() {
      return this.croppa.generateDataUrl();
    },
  },
};
</script>

<style>
.croppa-container {
  background-color: white;
  border: 2px dashed grey;
  border-radius: 8px;
  font-family: "Roboto", sans-serif !important;
}
.image-uploader-circular {
  border-radius: 100%;
}
</style>
