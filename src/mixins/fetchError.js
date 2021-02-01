import FetchError from "@/components/FetchError";

export default {
  components: {
    FetchError,
  },
  methods: {
    setFetchError(error) {
      this.fetchError = error;
    },
  },
  data() {
    return {
      fetchError: null,
    };
  },
};
