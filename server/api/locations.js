export default defineEventHandler(async(event) => {
  const response = await fetch("https://api.usmart.io/org/d1b773fa-d2bd-4830-b399-ecfd18e832f3/02444e7a-5bd4-4ef3-9c66-e26671bb4c8a/latest/urql?aggregate(Location,Longitude,Latitude,value_count(Location))");
  const locationData = await response.json();
  return locationData
})
