// uptimer-status.js
// Deprecated -- no longer in use
// const statusURL2 =
//   "https://api.uptimerobot.com/v2/getMonitors?api_key=ur1232403-44c73d065f5fd398a7192566";
// const endpointIds2 = [787532615, 787532613, 787532614];
// fetch(statusURL2, { method: "POST" })
//   .then((response) => response.json())
//   .then((response) => {
//     const endpointStatuses2 = response.monitors
//       .filter((monitor) => endpointIds2.includes(monitor.id))
//       .map((monitor) => monitor.status);
//     const isHealthy2 = endpointStatuses2.every((status) => status === 2);
//     if (!isHealthy2) {
//       const banner = document.querySelector(".c-ubanner");
//       banner.style.setProperty("display", "flex");
//     }
//   })
//   .catch((error) =>
//     console.error("Error while checking endpoint statuses: ", error)
//   );
