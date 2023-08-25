<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import moment from "moment";
import "chartjs-adapter-moment";
import { Line } from "vue-chartjs";
import { pedestrianDataset, bicycleDataset } from "@/store/index";
// import zoomPlugin from "chartjs-plugin-zoom";

// handle the SSR error due to the window object of Hammer JS
onMounted(() => {
  if (process.client) {
    import("chartjs-plugin-zoom").then((zoomPlugin) => {
      ChartJS.register(zoomPlugin.default);
    });
  }
});

import {
  Chart as ChartJS,
  TimeSeriesScale,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  TimeSeriesScale,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  selectedData: {
    type: Object,
  },
});

watch(props, () => {
  // extract the bicycle data

  bicycleData.value = props.selectedData.value.filter(
    (item) => item["Class Name"] === "bicycle"
  );

  bicycleDataset.value = bicycleData.value.map((item) => {
    return {
      x: moment(item["ISODateTime"]).format("YYYY-MM-DD"),
      y: item["Count"],
    };
  });

  //sort the data by date
  bicycleDataset.value = bicycleDataset.value.sort((a, b) => {
    return moment(a.x).diff(moment(b.x));
  });

  pedestrianData.value = props.selectedData.value.filter(
    (item) => item["Class Name"] === "pedestrian"
  );

  pedestrianDataset.value = pedestrianData.value.map((item) => {
    return {
      x: moment(item["ISODateTime"]).format("YYYY-MM-DD"),
      y: item["Count"],
    };
  });

  //sort the data by date
  pedestrianDataset.value = pedestrianDataset.value.sort((a, b) => {
    return moment(a.x).diff(moment(b.x));
  });
});

const bicycleData = ref();
const pedestrianData = ref();


// // extract the bicycle data
// bicycleData.value = props.selectedData.filter(
//   (item) => item["Class Name"] === "bicycle"
// );
// // const bicycleDataset = ref();
// bicycleDataset.value = bicycleData.value.map((item) => {
//   return {
//     x: moment(item["ISODateTime"]).format("YYYY-MM-DD"),
//     y: item["Count"],
//   };
// });

// //sort the data by date
// bicycleDataset.value = bicycleDataset.value.sort((a, b) => {
//   return moment(a.x).diff(moment(b.x));
// });

// //extract the pedestrian data
// pedestrianData.value = props.selectedData.filter(
//   (item) => item["Class Name"] === "pedestrian"
// );
// // const pedestrianDataset = ref();

// pedestrianDataset.value = pedestrianData.value.map((item) => {
//   return {
//     x: moment(item["ISODateTime"]).format("YYYY-MM-DD"),
//     y: item["Count"],
//   };
// });

// //sort the data by date
// pedestrianDataset.value = pedestrianDataset.value.sort((a, b) => {
//   return moment(a.x).diff(moment(b.x));
// });

// const chartData = ref({
//   datasets: [
//     {
//       label: "Bicycle",
//       // borderColor: "#42b983",
//       backgroundColor: "#143C6A",
//       pointStyle: 'circle',
//       pointRadius: 5,
//       pointHoverRadius: 10,
//       data: bicycleDataset.value,
//     },
//     {
//       label: "Pedestrian",
//       // borderColor: "#F88070",
//       backgroundColor: "#F88070",
//       pointStyle: 'circle',
//       pointRadius: 5,
//       pointHoverRadius: 10,
//       data: pedestrianDataset.value,
//     },
//   ],
// });

const chartData = computed(() => ({
  datasets: [
    {
      label: "Bicycle",
      // borderColor: "#42b983",
      backgroundColor: "#143C6A",
      pointStyle: "circle",
      pointRadius: 5,
      pointHoverRadius: 10,
      data: bicycleDataset.value,
    },
    {
      label: "Pedestrian",
      // borderColor: "#F88070",
      backgroundColor: "#F88070",
      pointStyle: "circle",
      pointRadius: 5,
      pointHoverRadius: 10,
      data: pedestrianDataset.value,
    },
  ],
}));

const chartOptions = ref({
  tension: 0.5,
  tooltips: {
    mode: "dataset",
    intersect: false,
  },
  plugins: {
    zoom: {
      pan: {
        enabled: true,
        mode: "x",
      },
      zoom: {
        wheel: {
          enabled: true,
          speed: 0.05,
        },
        pinch: {
          enabled: false,
        },
        mode: "x",
      },
    },
    legend: {
      position: "top",
      align: "end",
    },
  },
  scales: {
    x: {
      type: "time",
      // min: moment().subtract(60, "days"),
      time: {
        unit: "day",
      },
    },
    y: {
      beginAtZero: true,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<style lang="scss" scoped></style>
