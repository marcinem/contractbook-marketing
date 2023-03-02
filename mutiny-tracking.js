function mutinyToStorage() {
  var sessionArray =
    JSON.parse(sessionStorage.getItem("mutiny_experience_data")) || [];
  var newArray = window.mutiny.client ? window.mutiny.client.experiences : [];

  newArray.forEach(function (a) {
    if (sessionArray.length < 5) {
      sessionArray.unshift(a);
    } else {
      sessionArray.unshift(a);
      sessionArray.pop();
    }
  });
  sessionStorage.setItem(
    "mutiny_experience_data",
    JSON.stringify(sessionArray),
  );
}

//variant: "498f9ef2-2891-46b4-b14b-e95504b6e8d5"
//control: "689893e9-9e5f-4ac6-944e-be702449f8db"

function updateHubspotFields() {
  var audienceSegmentClass = "mutiny_audience_segment";
  var experienceNameClass = "mutiny_experience_names";
  var impressionTypeClass = "mutiny_impression_type";
  var variationNamesClass = "mutiny_variation_names";

  var experiences =
    JSON.parse(sessionStorage.getItem("mutiny_experience_data")) || [];
  var audienceSegments = experiences
    .map(function (a) {
      return a.audienceSegment.name;
    })
    .join();
  document.querySelector('input[name="' + audienceSegmentClass + '"]')
    ? (document.querySelector(
        'input[name="' + audienceSegmentClass + '"]',
      ).value = audienceSegments)
    : null;

  var experienceNames = experiences
    .map(function (a) {
      return a.experience.description;
    })
    .join();
  document.querySelector('input[name="' + experienceNameClass + '"]')
    ? (document.querySelector(
        'input[name="' + experienceNameClass + '"]',
      ).value = experienceNames)
    : null;

  var impressionTypes = experiences
    .map(function (a) {
      return a.impressionType;
    })
    .join();
  document.querySelector('input[name="' + impressionTypeClass + '"]')
    ? (document.querySelector(
        'input[name="' + impressionTypeClass + '"]',
      ).value = impressionTypes)
    : null;

  var variationNames = experiences
    .map(function (a) {
      return a.experience.variation_name;
    })
    .join();
  document.querySelector('input[name="' + variationNamesClass + '"]')
    ? (document.querySelector(
        'input[name="' + variationNamesClass + '"]',
      ).value = variationNames)
    : null;
}

if (window.mutiny.client.experiences) {
  mutinyToStorage();
} else {
  window.addEventListener("mutiny:experience-impression", function (event) {
    mutinyToStorage();
  });
}

if (document.querySelector('form[id^="hsForm"]')) {
  updateHubspotFields();
} else {
  window.addEventListener("message", function (event) {
    if (
      event.data.type === "hsFormCallback" &&
      event.data.eventName === "onFormReady"
    ) {
      updateHubspotFields();
    }
  });
}
