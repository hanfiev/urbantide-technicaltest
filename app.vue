<template>
  <div class="main">
    <!-- HEADER -->
    <div class="header">
      <img src="/cycling.png" height="50" alt="" />
      <div class="title">
        <span class="heading">Cycling Scotland </span>| National Monitoring Framework
      </div> 
    </div>
    <!-- CONTENT -->
    <div class="content">
      <!-- SIDEBAR SECTION-->
      <div class="locationsList">
        <div class="searchBar">
          <span class="material-symbols-rounded icon"> search </span>
          <input
            v-model="search"
            class="searchInput"
            type="text"
            placeholder="Search"
          />
          <span
            @click="search = ''"
            v-if="search.length > 0"
            class="material-symbols-rounded icon"
          >
            close
          </span>
        </div>
        <div class="lists">
          <div
            class="list"
            v-for="(place, index) in filteredItems"
            :key="index"
            @click="handleListClick"
          >
            {{ place.place }}
          </div>
        </div>
      </div>
      <!-- MAP CHART SECTION -->
      <div class="mapSection">
        <!-- MAP COMPONENT -->
        <Map class="map" :places="flattenedData" />
        <!-- CHART COMPONENT -->
        <div v-if="viewDetail" class="locationDetailSection">
          <!-- SELECTED PLACE TITLE -->
          <div class="locationDetail">
            <div class="locationName">{{ selectedLocation.place }}</div>
            <div class="action" @click="handleCloseViewDetail">
              <span class="material-symbols-rounded"> close </span>
            </div>
          </div>
          <!-- SELECTED PLACE BICYCLE AND PEDESTRIAN DATA -->
          <div class="modeDetail">
            <!-- BICYCLE DATA -->
            <div class="mode">
              <div class="heading">
                <span class="material-symbols-rounded"> pedal_bike </span>
                Bicycle
              </div>
              <div class="data">
                <div>
                  <span class="bold">{{ bicycleDataset.length }}</span> <br />
                  Records <br />
                  <span class="date"
                    >{{ bicycleStartDate }} - {{ bicycleEndDate }}</span
                  >
                </div>
                <div>
                  <span class="bold">{{ bicycleMaxCount }}</span> <br />
                  Max count <br />
                  <span class="date">{{ bicycleMaxDate }}</span>
                </div>
              </div>
            </div>
            <!-- PEDESTRIAN DATA -->
            <div class="mode">
              <div class="heading">
                <span class="material-symbols-rounded"> directions_walk </span>
                Pedestrian
              </div>
              <div class="data">
                <div>
                  <span class="bold">{{ pedestrianDataset.length }} </span>
                  <br />
                  Records <br />
                  <span class="date"
                    >{{ pedestrianStartDate }} - {{ pedestrianEndDate }}</span
                  >
                </div>
                <div>
                  <span class="bold">{{ pedestrianMaxCount }}</span> <br />
                  Max count <br />
                  <span class="date">{{ pedestrianMaxDate }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- CHART -->
          <Chart class="chart" :selectedData="selectedData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import all states and functions from the store and composables
import {
  selectedLocation,
  selectedData,
  viewDetail,
  pedestrianDataset,
  bicycleDataset,
  bicycleMaxCount,
  bicycleMaxDate,
  pedestrianMaxCount,
  pedestrianMaxDate,
  bicycleStartDate,
  bicycleEndDate,
  pedestrianStartDate,
  pedestrianEndDate,
} from "@/store/index";

import { fetchDetail, dateConverter } from "@/composables/functions";

// Fetch the locations data to draw on the map
/// Local API
// const locations = await useFetch("/api/locations-local");

/// uSmart API
const locations = await useFetch("/api/locations")

// transform the data from the API into a single level array of objects by using a nested loop, 
const flattenedData = [];
if(locations.data.value) {
  locations.data.value.forEach((item) => {
  for (const place in item) {
    for (const longitude in item[place]) {
      for (const latitude in item[place][longitude]) {
        const count = item[place][longitude][latitude]["Location_value_count"];
        flattenedData.push({
          place,
          longitude,
          latitude,
          count,
        });
      }
    }
  }
});
}

// Search List Functions
const search = ref("");
// Filter the data based on the search query
const filteredItems = computed(() => {
  if (!search.value) {
    return flattenedData; // If query is empty, return all items
  }

  // Otherwise, return the filtered items
  const query = search.value.toLowerCase();
  return flattenedData.filter((item) =>
    item.place.toLowerCase().includes(query)
  );
});

//handle list click
const handleListClick = async (e) => {
  // get the place name from the clicked list
  const place = e.target.innerText;

  // filter the data based on the place name
  const selected = flattenedData.filter((item) => item.place === place);
  selectedLocation.value = selected[0];

  // toggle the view detail state and reset the datasets
  viewDetail.value = true;
  pedestrianDataset.value = [];
  bicycleDataset.value = [];

  // fetch the detail data from the API
  selectedData.value = await fetchDetail(place);
};

// handle close view detail
const handleCloseViewDetail = () => {
  viewDetail.value = false;
};


// Watch the datasets and update the max count and max date when the value changes
watch(bicycleDataset, () => {
  // if the dataset is empty, return
  if (bicycleDataset.value.length === 0) return;

  // reset the max count and max date
  bicycleMaxCount.value = 0;
  bicycleMaxDate.value = "";
  
// loop through the dataset and update the max count and max date
  bicycleDataset.value.forEach((item) => {
    if (item.y >= bicycleMaxCount.value) {
      bicycleMaxCount.value = item.y;
      bicycleMaxDate.value = item.x;
    }
  });

  // convert the max date to a text format (YYYY-MM-DD to DD MMM YY)
  bicycleMaxDate.value = dateConverter(bicycleMaxDate.value);

  // set the start date and end date and convert them to a text format (YYYY-MM-DD to DD MMM YY)
  bicycleStartDate.value = bicycleDataset.value[0].x;
  bicycleStartDate.value = dateConverter(bicycleStartDate.value);

  bicycleEndDate.value = bicycleDataset.value[bicycleDataset.value.length - 1].x;
  bicycleEndDate.value = dateConverter(bicycleEndDate.value);

  
});

watch(pedestrianDataset, () => {
  // if the dataset is empty, return
  if (pedestrianDataset.value.length === 0) return;

  // reset the max count and max date
  pedestrianMaxCount.value = 0;
  pedestrianMaxDate.value = "";

  // loop through the dataset and update the max count and max date
  pedestrianDataset.value.forEach((item) => {
    if (item.y >= pedestrianMaxCount.value) {
      pedestrianMaxCount.value = item.y;
      pedestrianMaxDate.value = item.x;
    }
  });

  // convert the max date to a text format (YYYY-MM-DD to DD MMM YY)
  pedestrianMaxDate.value = dateConverter(pedestrianMaxDate.value);

  // set the start date and end date and convert them to a text format (YYYY-MM-DD to DD MMM YY)
  pedestrianStartDate.value = pedestrianDataset.value[0].x;
  pedestrianStartDate.value = dateConverter(pedestrianStartDate.value);

  pedestrianEndDate.value = pedestrianDataset.value[pedestrianDataset.value.length - 1].x;
  pedestrianEndDate.value = dateConverter(pedestrianEndDate.value);

});


</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: "Plus Jakarta Sans";
  // transition: all 0.1s ease-in-out;
}

.material-symbols-rounded {
  cursor: pointer;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

.main {
  display: flex;
  flex-direction: column;
  width: 100dvw;
  height: 100dvh;
}

.header {
  width: 100dvw;
  height: 50px;
  background-color: #143c6a;
  display: flex;
  align-items: center;
  padding: 15px;
  color: #fff;
  box-sizing: border-box;
}

.header .title .heading {
  font-weight: 600;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
}

.content .locationsList .searchBar {
  width: 100%;
  background-color: #0b2442;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 7px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.content .locationsList .searchBar .icon {
  font-size: 14pt;
}

.content .locationsList .searchBar .searchInput {
  width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  color: #fff;
}

.content .locationsList {
  color: #86a2c1;
  min-width: 300px;
  width: 300px;
  background-color: #0d2d52;
  padding: 15px;
  box-sizing: border-box;
  height: calc(100dvh - 50px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content .locationsList .lists {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content .locationsList .lists .list {
  font-size: 10pt;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.content .locationsList .lists .list:hover {
  transform: translateY(-1px);
  color: #fff;
}

.content .mapSection {
  min-width: calc(100% - 300px);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content .mapSection .locationDetailSection {
  height: 350px;
  width: 100%;
  padding: 0px 15px 15px 15px;
  box-sizing: border-box;
}

.content .mapSection .locationDetailSection .locationName {
  font-weight: 700;
}

.content .mapSection .locationDetailSection .locationDetail {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.content .mapSection .locationDetailSection .date {
  font-size: 11pt;
}

.map {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 200px;
  cursor: pointer;
  box-sizing: border-box;
  margin-top: 10px;
}

.modeDetail {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  align-items: center;
  justify-content: space-evenly;
}

.modeDetail .mode {
  width: 100%;
}

.modeDetail .heading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  margin-bottom: 10px;
}

.modeDetail .data {
  font-size: 9pt;
  font-weight: 700;
  display: flex;
  gap: 30px;
  text-transform: uppercase;
}

.modeDetail .data .bold {
  font-weight: 700;
}

.modeDetail .data .date {
  color: #737373;
  font-weight: 500;
  font-size: 9pt !important;
  text-transform: uppercase;
}
</style>

