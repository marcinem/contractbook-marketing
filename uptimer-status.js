// uptimer-status.js
const statusURL =
  "https://api.uptimerobot.com/v2/getMonitors?api_key=ur1232403-44c73d065f5fd398a7192566";
const endpointIds = [787532615, 787532613, 787532614];
fetch(statusURL, { method: "POST" })
  .then((response) => response.json())
  .then((response) => {
    const endpointStatuses = response.monitors
      .filter((monitor) => endpointIds.includes(monitor.id))
      .map((monitor) => monitor.status);
    const isHealthy = endpointStatuses.every((status) => status === 2);
    if (!isHealthy) {
      const banner = document.querySelector(".c-ubanner");
      banner.style.setProperty("display", "flex");
    }
  })
  .catch((error) =>
    console.error("Error while checking endpoint statuses: ", error)
  );
