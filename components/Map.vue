<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}
</style>

<script setup>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { selectedLocation, selectedData, viewDetail } from "@/store/index";
import { fetchDetail } from "@/composables/functions";

const props = defineProps({
  places: Array,
});

const emit = defineEmits(["map-click"]);

// const apiKey = useRuntimeConfig().public.apiKey
const apiKey = "pk.eyJ1IjoicGxhY2VsaXN0LXh5eiIsImEiOiJjbGowNWVyd2kwYmlmM2ZsbDd3dncyMDBsIn0.6fs74C_YZ61hdUSozvyK_g";

let map;

onMounted(() => {
  mapboxgl.accessToken = apiKey;
  map = new mapboxgl.Map({
    container: "map",
    center: [-73.9965, 40.7295],
    zoom: 2,
  });

  map.on("load", () => {
    map.loadImage("/cycling.png", (error, image) => {
      if (error) throw error;

      // Add the image to the map style.
      map.addImage("cycling", image);
    });
    //generate geojson from places prop
    const geojson = {
      type: "FeatureCollection",
      features: props.places.map((item) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.longitude, item.latitude],
          },
          properties: item,
        };
      }),
    };

    map.addSource("places", {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: "places",
      type: "symbol",
      source: "places",
      layout: {
        "icon-allow-overlap": true,
        "icon-image": "cycling",
        "icon-size": 0.2,
      },
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("mouseenter", "places", (e) => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.place;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseleave", "places", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });


    map.on("click", "places", async (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["places"],
      });
      const feature = features[0];
      selectedLocation.value = feature.properties;
      console.log(selectedLocation.value.place);
      viewDetail.value = true;
      selectedData.value = await fetchDetail(selectedLocation.value.place);
    });

    map.resize();

    // Create an array of the bound coordinates for each marker
    var markerCoordinates = props.places.map(function (item) {
      return [item.longitude, item.latitude];
    });

    // Create a new LngLatBounds object
    var bounds = new mapboxgl.LngLatBounds();

    // Extend the bounds object with each marker's coordinates
    markerCoordinates.forEach(function (marker) {
      bounds.extend(marker);
    });

    // Fit the map to the calculated bounds
    map.fitBounds(bounds, { padding: 20, duration: 9000 });

    // zoom to the selected location when selectedLocation updated
    watch(selectedLocation, (newValue, oldValue) => {
      if (newValue) {
        map.flyTo({
          center: [newValue.longitude, newValue.latitude],
          zoom: 17,
          essential: true,
          pitch: 60,
        });

        map.resize();
      }
    });

    // zoom out the map when viewDetail is false
    watch(viewDetail, (newValue, oldValue) => {
      if (!newValue) {
        map.flyTo({
          zoom: 10,
          essential: true,
          pitch: 0,
          bearing: 0,
          speed: 3,
        });

        map.resize();
      }
    });

  });
});
</script>
