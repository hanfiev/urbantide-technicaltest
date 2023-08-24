export default defineEventHandler(async(event) => {
  const query = getQuery(event)
  let location = query.location
  console.log(query)

  let encodedLocation = encodeURIComponent(location).replace(/%20/g, '%20')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29')
  .replace(/,/g, '%2C');

  let url = `https://api.usmart.io/org/d1b773fa-d2bd-4830-b399-ecfd18e832f3/02444e7a-5bd4-4ef3-9c66-e26671bb4c8a/latest/urql?limit(-1)&match(Location,${encodedLocation})&gt(Count,0)&select(ISODateTime,Count,Class%20Name)`
  console.log(url)
  const response = await fetch(url);
  const locationData = await response.json();
  return locationData
})
