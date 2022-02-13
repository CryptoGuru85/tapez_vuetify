<script>
import startOfHour from "date-fns/startOfHour";
import startOfDay from "date-fns/startOfDay";
import startOfWeek from "date-fns/startOfWeek";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import eachHourOfInterval from "date-fns/eachHourOfInterval";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import differenceInDays from "date-fns/differenceInDays";
import groupBy from "lodash/groupBy";
import subDate from "date-fns/sub";

export default {
  props: {
    query: {
      type: Array,
      default: () => [],
    },
    from: {
      type: Date,
      default: () => subDate(new Date(), { days: 1 }),
    },
    to: {
      type: Date,
      default: () => new Date(),
    },
    user: {
      type: String,
      default: null,
    },
  },
  computed: {
    dateReducer() {
      const difference = Math.abs(
        differenceInDays(this.interval.start, this.interval.end)
      );
      if (difference <= 1)
        return {
          reduce: startOfHour,
          group: eachHourOfInterval,
          format: "HH",
        };
      if (difference <= 7)
        return {
          reduce: startOfDay,
          group: eachDayOfInterval,
          format: "dd.",
        };
      else
        return {
          reduce: startOfWeek,
          group: eachWeekOfInterval,
          format: "MM-dd",
        };
    },
    interval() {
      return {
        start: this.from,
        end: this.to,
      };
    },
    byDate() {
      const grouped = groupBy(this.entries, (entry) => {
        return this.dateReducer.reduce(new Date(entry.date));
      });
      let returnVal = {};
      const intervals = this.dateReducer.group(this.interval);
      for (let key of intervals) {
        returnVal[key] = grouped[key] ? grouped[key] : [];
      }
      return returnVal;
    },
    byDocument() {
      return groupBy(
        this.entries.filter((entry) => entry.for),
        (entry) => entry.for._id
      );
    },
  },
  data() {
    return {
      loading: false,
      entries: [],
      loaded: false,
    };
  },
  watch: {
    from() {
      this.fetchEntries();
    },
    to() {
      this.fetchEntries();
    },
    filter() {
      this.fetchEntries();
    },
    user() {
      this.fetchEntries();
    },
  },
  methods: {
    fetchEntries() {
      this.loading = true;
      this.$http
        .get(
          this.$apiURL("/api/statistics", [
            ...this.query,
            ["populate", "for,for.tape"],
            ["date", "<=", this.to.toISOString()],
            ["date", ">=", this.from.toISOString()],
          ])
        )
        .then((data) => data.data)
        .then((entries) => (this.entries = entries))
        .then(() => (this.loaded = true))
        .catch((err) => {
          this.$store.dispatch("ajaxError", err);
        })
        .then(() => (this.loading = false));
    },
  },
  created() {
    this.fetchEntries();
  },
  render() {
    return this.$scopedSlots.default({
      loading: this.loading,
      loaded: this.loaded,
      entries: this.entries,
      byDate: this.byDate,
      byDocument: this.byDocument,
      interval: {
        start: this.from,
        end: this.to,
      },
    });
  },
};
</script>

<style></style>
