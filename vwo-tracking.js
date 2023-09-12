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

  captureExperiments();
  checkHubspotFormAndRun();
  sendEventsToPlausible();
};

const captureExperiments = () => {
  window.VWO = window.VWO || [];
  let newData = {};
  window.VWO.push([
    "onVariationApplied",
    function (data) {
      if (!data) {
        return;
      }
      var expId = data[1],
        variationId = data[2];
      if (typeof _vwo_exp[expId].comb_n[variationId] !== "undefined") {
        newData[expId] = {
          expId,
          name: _vwo_exp[expId].name,
          variation: _vwo_exp[expId].comb_n[variationId],
        };
      }
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
      //test
      console.log(localStorage.getItem("vwo_experiments"));
    },
  ]);
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
    }, 4000);
  });
};
checkVWO();
