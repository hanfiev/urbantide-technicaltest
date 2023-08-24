export const fetchDetail = async(location) => {
  let encodedLocation = encodeURIComponent(location).replace(/%20/g, '%20')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29')
  .replace(/,/g, '%2C');

  let url = `/api/details?location=${encodedLocation}`
  const { data } = await useFetch(url)
  return data
}