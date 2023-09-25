const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
};

const checkVWO = () => {
  if (getCookie("_vis_opt_out")) {
    console.log("::: Opted out of VWO");
    return;
  }

  if (window.VWO) {
    captureExperiments();
    checkHubspotFormAndRun();
    sendEventsToPlausible();
  } else {
    setTimeout(checkVWO, 2000);
  }
};

const captureExperiments = () => {
  let newData = {};

  window.VWO = window.VWO || [];
  VWO.push([
    "onEventReceive",
    "vA",
    function (data) {
      // To fetch A/B test id
      var experimentId = data[1];
      // To fetch A/B test active variation name
      var variationId = data[2];
      // To get A/B test name
      var abTestName = _vwo_exp[experimentId].name;
      // To get A/B test active variation name
      var variationName = _vwo_exp[experimentId].comb_n[variationId];
      // To get A/B test active experiment type name
      var experimentTypeName = _vwo_exp[experimentId].type;

      if (
        typeof _vwo_exp[experimentId].comb_n[variationId] !== "undefined" &&
        ["VISUAL_AB", "VISUAL", "SPLIT_URL", "SURVEY"].indexOf(
          _vwo_exp[experimentId].type,
        ) > -1
      ) {
        newData[id] = {
          experimentId,
          name: abTestName,
          type: experimentTypeName,
          variation: variationName,
        };
        // Write your logic here to send the data at your end
        console.log(
          experimentId + ":" + abTestName + variationName + experimentTypeName,
        );
      }
    },
  ]);

  // Merge existing data with new data
  const existingData =
    JSON.parse(localStorage.getItem("vwo_experiments")) || [];
  const existingDataMap = Object.fromEntries(
    existingData.map((e) => [e.id, e]),
  );

  // Overwrite or add new experiments
  Object.assign(existingDataMap, newData);

  // Convert back to array and store in localStorage
  const mergedData = Object.values(existingDataMap);
  localStorage.setItem("vwo_experiments", JSON.stringify(mergedData));
};

const updateVwoHubspotFields = () => {
  const experienceNameClass = "vwo_experience_names";
  const impressionTypeClass = "vwo_impression_type";
  const variationNamesClass = "vwo_variation_names";

  const experiences = JSON.parse(localStorage.getItem("vwo_experiments")) || [];

  const updateField = (className, value) => {
    const field = document.querySelector(`input[name="${className}"]`);
    if (field) field.value = value;
  };

  updateField(experienceNameClass, experiences.map((a) => a.name).join());
  updateField(impressionTypeClass, experiences.map((a) => a.type).join());
  updateField(variationNamesClass, experiences.map((a) => a.variation).join());
};

const checkHubspotFormAndRun = () => {
  if (document.querySelector('form[id^="hsForm"]')) {
    updateVwoHubspotFields();
  } else {
    window.addEventListener("message", (event) => {
      if (
        event.data?.type === "hsFormCallback" &&
        event.data?.eventName === "onFormReady"
      ) {
        updateVwoHubspotFields();
      }
    });
  }
};

const sendEventsToPlausible = () => {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const experienceStorage = JSON.parse(
        localStorage.getItem("vwo_experiments"),
      );
      if (experienceStorage) {
        experienceStorage.forEach(({ name, variation }) => {
          plausible("VWO", {
            props: {
              experiment: `${name} | ${variation}`,
            },
          });
        });
      }
    }, 2000);
  });
};

setTimeout(checkVWO, 2000);
