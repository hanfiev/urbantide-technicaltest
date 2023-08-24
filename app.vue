<template>
  <div class="main">
    <div class="header">
      <img src="/cycling.png" height="50" alt="" />
      <div class="title">
        <span class="heading">Cycling Scotland </span>| National Monitoring
        Framework
      </div>
      <!-- <img src="/logo.svg" height="30" alt=""> -->
    </div>

    <div class="content">
      <div class="locationsList">
        <!-- {{ selectedData }} -->
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
      <div class="mapSection">
        <Map class="map" :places="flattenedData" />
        <div v-if="viewDetail" class="locationDetailSection">
          <div class="locationDetail">
            <div class="locationName">{{ selectedLocation.place }}</div>
            <div class="action" @click="handleCloseViewDetail">
              <span class="material-symbols-rounded"> close </span>
            </div>
          </div>
          <div class="date">21 September 2021 - 20 May 2023</div>
          <div class="modeDetail">
            <div class="modeDetailHeading">

                <span class="material-symbols-rounded"> pedal_bike </span>
                Bicycle

            </div>
            <div class="modeDetailHeading">
                <span class="material-symbols-rounded"> directions_walk </span>
                Pedestrian
            </div>
          </div>
          <Chart class="chart" :selectedData="selectedData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { selectedLocation, selectedData, viewDetail, pedestrianDataset, bicycleDataset  } from "@/store/index";

// const { data } = await useFetch("/api/detail-local");
const locations = await useFetch("/api/locations-local");

// const locations = await useFetch("/api/locations")
// const selectedData = ref();

//local handle
// if (data) {
//   selectedData.value = data.value.data;
//   console.log(selectedData.value);
// }

import { fetchDetail } from "@/composables/functions";



const cleanedData = ref();

// process the data from the API by using a nested loop, into a single level array of objects.
const flattenedData = [];

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

const search = ref("");
const filteredItems = computed(() => {
  if (!search.value) {
    return flattenedData; // If query is empty, return all items
  }

  const query = search.value.toLowerCase();
  return flattenedData.filter((item) =>
    item.place.toLowerCase().includes(query)
  );
});

//handle list click
const testData = ref()

const handleListClick = async(e) => {
  const place = e.target.innerText;
  const selected = flattenedData.filter((item) => item.place === place);
  selectedLocation.value = selected[0];
  viewDetail.value = true;
  pedestrianDataset.value = []
  bicycleDataset.value = []
  selectedData.value = await fetchDetail(place)
};

const handleCloseViewDetail = () => {
  viewDetail.value = false;
};
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
}

.modeDetail .modeDetailHeading {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
```
