// form-trackers-2.0.js
// Get all the know parameters and cookie values
// and construct the new object
var trackingParams, fbcCookie, fbpCookie;
window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormReady"
  ) {
    trackingParams = JSON.parse(Cookies.get("__utm"));
    fbcCookie = Cookies.get("_fbc");
    fbpCookie = Cookies.get("_fbp");
    fillForms();
  }
});

function buildTrackingJar() {
  return new Promise((resolve, reject) => {
    // check Facebook cookies
    (function lookForFbp(i) {
      if (!fbpCookie) {
        setTimeout(function () {
          fbpCookie = Cookies.get("_fbp");
          fbcCookie = Cookies.get("_fbc");
          if (--i) {
            lookForFbp(i);
          } else {
            getKnownParams();
            resolve();
          }
        }, 2000);
      } else {
        getKnownParams();
        resolve();
      }
    })(3);
  });
}
// comment
function getKnownParams() {
  trackingParams["fb_browser_id"] = fbpCookie || "";
  // validation of Fb Clid cookie
  var timestamp = trackingParams.timestamp;
  // Cookie exists && has correct formatting
  if (fbcCookie) {
    if (fbcCookie.includes("fb.")) {
      trackingParams["fbclid"] = fbcCookie;
    } else {
      // Cookie exists but has wrong formatting
      trackingParams["fbclid"] = "fb.1." + timestamp + "." + fbcCookie;
    }
    // Cookie DOESNT exist && param exists and it's not empty, && param has wrong formatting
  } else if (!fbcCookie && trackingParams.fbclid) {
    if (
      trackingParams.fbclid !== "" &&
      !trackingParams.fbclid.includes("fb.")
    ) {
      trackingParams.fbclid = "fb.1." + timestamp + "." + trackingParams.fbclid;
    }
  }

  // get gclid from the local storage
  if (sessionStorage.getItem("gclid")) {
    trackingParams["gclid"] = sessionStorage.getItem("gclid");
  }
  if (localStorage.getItem("lp")) {
    trackingParams["landing_page"] = localStorage.getItem("lp");
  }

  // save information about convertion page
  trackingParams["conversion_page"] = window.location.href;

  // get IP from the local storage
  if (sessionStorage.getItem("clientIp")) {
    trackingParams["ip_address_form"] = sessionStorage.getItem("clientIp");
  }

  // get user agent
  trackingParams["client_user_agent"] = window.navigator.userAgent;

  // Facebook event unique ID
  var fbEventId = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

  trackingParams["facebook_event_id"] = fbEventId;
}

// fill all the fields

async function fillForms() {
  console.log("Caller v1.0.1");
  await buildTrackingJar();
  for (const [key, value] of Object.entries(trackingParams)) {
    var fields = document.querySelectorAll(`[name="${key}"]`);
    if (fields.length) {
      fields.forEach(function (field) {
        field.value = value;
      });
    }
  }
}

// // fuction to debug the script on production
// // async function fillForms() {
//   await buildTrackingJar();
//   var paramsField = document.querySelector('[name="analytics_logs"]');
//   var objectsField = document.querySelector('[name="analytics_logs_lukas"]');
//   var objectsFieldVals = "";

//   paramsField.value = JSON.stringify(trackingParams);

//   for (const [key, value] of Object.entries(trackingParams)) {
//     var fields = document.querySelectorAll(`[name="${key}"]`);
//     if (fields.length) {
//       fields.forEach(function (field) {
//         objectsFieldVals =
//           objectsFieldVals +
//           field.nodeName +
//           ": name= " +
//           field.name +
//           "| value=" +
//           value;
//         objectsField.value = objectsFieldVals;
//       });
//     }
//   }
// }
