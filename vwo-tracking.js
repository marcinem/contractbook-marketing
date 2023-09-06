const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay

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

  if (window._vwo_exp_ids) {
    captureExperiments();
    checkHubspotFormAndRun();
    sendEventsToPlausible();
    console.log("::: VWO started");
  } else {
    setTimeout(checkVWO, 50);
  }
};

const captureExperiments = (retryCount = 0) => {
  const experiments = window._vwo_exp_ids;
  let data = [];

  if (experiments) {
    for (let i = 0; i < experiments.length; i++) {
      const id = experiments[i];
      const experiment = window._vwo_exp[id];

      if (experiment) {
        const combinationNum = experiment.combination_chosen;
        const variationName = experiment.comb_n[combinationNum];

        if (!variationName) {
          console.warn(`Missing variationName for experiment ID: ${id}`);
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => captureExperiments(retryCount + 1), RETRY_DELAY);
          } else {
            console.error(
              `Max retries reached. Unable to capture experiment with ID: ${id}`,
            );
          }
          continue;
        }

        if (experiment.status === "RUNNING") {
          data.push({
            id,
            name: experiment.name,
            type: experiment.type,
            variation: variationName,
          });
        }
      }
    }
  }

  const existingData =
    JSON.parse(localStorage.getItem("vwo_experiments")) || [];

  data.forEach((newExperiment) => {
    const index = existingData.findIndex(
      (existingExperiment) => existingExperiment.id === newExperiment.id,
    );

    if (index === -1) {
      existingData.unshift(newExperiment);
      if (existingData.length > 5) {
        existingData.pop();
      }
    } else {
      Object.assign(existingData[index], newExperiment);
    }
  });

  localStorage.setItem("vwo_experiments", JSON.stringify(existingData));
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
    }, 2600);
  });
};

checkVWO();
