const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 second delay

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
    setTimeout(checkVWO, 150);
  }
};

const captureExperiments = async (retryCount = 0) => {
  const experiments = window._vwo_exp_ids;
  if (!experiments) return;

  let data = [];

  for (const id of experiments) {
    const experiment = window._vwo_exp[id];
    if (!experiment) continue;

    const { combination_chosen, comb_n, status, name, type } = experiment;
    const variationName = comb_n[combination_chosen];

    if (!variationName && retryCount < MAX_RETRIES) {
      return setTimeout(() => captureExperiments(retryCount + 1), RETRY_DELAY);
    }

    if (status === "RUNNING") {
      data.push({
        id,
        name,
        type,
        variation: variationName,
      });
    }
  }

  const existingData =
    JSON.parse(localStorage.getItem("vwo_experiments")) || [];
  const newData = [...existingData, ...data].slice(0, 5);

  localStorage.setItem("vwo_experiments", JSON.stringify(newData));
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
