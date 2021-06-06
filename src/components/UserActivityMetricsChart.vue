<script>
import differenceInDays from "date-fns/differenceInDays";
import formatDate from "date-fns/format";
import { Line, mixins } from "vue-chartjs";
import "chartjs-adapter-date-fns";
import colors from "vuetify/lib/util/colors";

export default {
  mixins: [Line, mixins.reactiveData],
  props: {
    statistics: {
      type: Object,
      default: () => {},
    },
    filter: {
      type: Function,
      default: (entries) => entries,
    },
    title: {
      type: String,
      default: () => "",
    },
  },
  watch: {
    statistics() {
      const entries = Object.entries(this.statistics.byDate);
      try {
        const views = entries.map((entry) => ({
          t: new Date(entry[0]),
          y: entry[1].filter((entry) => entry.type == "view").length,
        }));
        const downloads = entries.map((entry) => ({
          t: new Date(entry[0]),
          y: entry[1].filter((entry) => entry.type == "download").length,
        }));
        const plays = entries.map((entry) => ({
          t: new Date(entry[0]),
          y: entry[1].filter((entry) => entry.type == "play").length,
        }));
        this.chartData = {
          datasets: [
            {
              label: this.$tc(
                "component.user_activity_metrics_chart.label_views",
                2
              ),
              borderColor: colors.green.base,
              fill: false,
              data: views,
            },
            {
              label: this.$tc(
                "component.user_activity_metrics_chart.label_downloads",
                2
              ),
              borderColor: colors.blue.base,
              fill: false,
              data: downloads,
            },
            {
              label: this.$tc(
                "component.user_activity_metrics_chart.label_play",
                2
              ),
              borderColor: colors.blueGrey.base,
              fill: false,
              data: plays,
            },
          ],
        };
      } catch {
        this.chartData = {};
      }
    },
  },
  data() {
    return {
      chartData: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              display: true,
              scaleLabel: {
                display: false,
              },
              time: {
                displayFormats: {
                  millisecond: "HH:mm:ss.SSS",
                  second: "HH:mm:ss",
                  minute: "HH:mm",
                  hour: "HH:mm",
                },
                round: true,
              },
              ticks: {
                major: {
                  fontStyle: "bold",
                  fontColor: "#FF0000",
                },
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                stepSize: 1,
                suggestedMax: 5,
              },
            },
          ],
        },
      },
    };
  },
  methods: {
    formatKey(key) {
      const difference = Math.abs(
        differenceInDays(
          this.statistics.interval.start,
          this.statistics.interval.end
        )
      );

      if (difference <= 1) return formatDate(new Date(key), "ccc HH:ss");
      else if (difference <= 60) return formatDate(new Date(key), "MM-dd");
      else if (difference <= 60) return formatDate(new Date(key), "MMM yy");
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>

<style></style>
