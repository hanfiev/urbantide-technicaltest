export const fetchDetail = async (location) => {
  let encodedLocation = encodeURIComponent(location)
    .replace(/%20/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/,/g, "%2C");

  let url = `/api/details?location=${encodedLocation}`;
  const { data } = await useFetch(url);
  return data;
};

export const dateConverter = (inputString) => {
  // Split the string into year, month, and day
  const [year, month, day] = inputString.split("-");

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Convert the month value to its corresponding name
  const monthName = monthNames[parseInt(month) - 1];

  // Get the last two digits of the year
  const shortYear = year.slice(-2);

  // Form the desired output string
  const outputString = `${day} ${monthName} ${shortYear}`;

  return outputString
};
