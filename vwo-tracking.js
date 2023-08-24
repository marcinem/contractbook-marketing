// Wait for the VWO code to be fully loaded and check if the opt_out cookie exists.
var checkVWO = function () {
  // Check if the "_vis_opt_out" cookie exists
  if (getCookie("_vis_opt_out")) {
    console.log("::: Opted out of VWO");
    return; // Exit the function if the cookie exists
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

// Capture the details of the running experiments
var captureExperiments = function () {
  var experiments = window._vwo_exp_ids;
  var data = [];

  if (experiments) {
    for (var i = 0; i < experiments.length; i++) {
      var id = experiments[i];
      var experiment = window._vwo_exp[id];

      if (experiment) {
        // Get the combination number and use it to get the variation name
        var combinationNum = experiment.combination_chosen;
        var variationName = experiment.comb_n[combinationNum];

        // Only include running experiments
        if (experiment.status === "RUNNING") {
          data.push({
            id: id,
            name: experiment.name,
            type: experiment.type,
            variation: variationName,
          });
        }
      }
    }
  }

  // Store the data in localStorage
  localStorage.setItem("vwo_experiments", JSON.stringify(data));
};

// Update Hubspot fields:
function updateVwoHubspotFields() {
  var experienceNameClass = "vwo_experience_names";
  var impressionTypeClass = "vwo_impression_type";
  var variationNamesClass = "vwo_variation_names";

  var experiences = JSON.parse(localStorage.getItem("vwo_experiments")) || [];

  var experienceNames = experiences
    .map(function (a) {
      return a.name;
    })
    .join();
  document.querySelector('input[name="' + experienceNameClass + '"]')
    ? (document.querySelector(
        'input[name="' + experienceNameClass + '"]',
      ).value = experienceNames)
    : null;

  var impressionTypes = experiences
    .map(function (a) {
      return a.type;
    })
    .join();
  document.querySelector('input[name="' + impressionTypeClass + '"]')
    ? (document.querySelector(
        'input[name="' + impressionTypeClass + '"]',
      ).value = impressionTypes)
    : null;

  var variationNames = experiences
    .map(function (a) {
      return a.variation;
    })
    .join();
  document.querySelector('input[name="' + variationNamesClass + '"]')
    ? (document.querySelector(
        'input[name="' + variationNamesClass + '"]',
      ).value = variationNames)
    : null;
}

function checkHubspotFormAndRun() {
  if (document.querySelector('form[id^="hsForm"]')) {
    updateVwoHubspotFields();
  } else {
    window.addEventListener("message", function (event) {
      if (
        event.data.type === "hsFormCallback" &&
        event.data.eventName === "onFormReady"
      ) {
        updateVwoHubspotFields();
      }
    });
  }
}

// Plausible event tracking
function sendEventsToPlausible() {
  window.addEventListener("load", () => {
    // this is wrapped in setTimeout because we need to wait for Plausbile to load.
    setTimeout(() => {
      var experienceStorage = JSON.parse(
        localStorage.getItem("vwo_experiments"),
      );
      if (experienceStorage) {
        experienceStorage.forEach(function (experiment) {
          plausible("VWO", {
            props: {
              experiment: experiment.name + " | " + experiment.variation,
            },
          });
        });
      }
    }, 2600);
  });
}

checkVWO();

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
