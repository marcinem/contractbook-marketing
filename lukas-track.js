rudderanalytics.load('2D7GkpONPqpodoirqdVOHtDbWKi','https://contractbobmi.dataplane.rudderstack.com');
rudderanalytics.page();

var cookieConsents = JSON.parse(Cookies.get("CookieScriptConsent"));
const hashed_user_id = rudderanalytics.getAnonymousId();
// Check for a cookie consent
if (
  cookieConsents.action === "accept" &&
  cookieConsents.categories.includes("performance")
) {
  rudderStackEventTracking();
}

function rudderStackEventTracking() {
  document.addEventListener("message", function (event) {
    if (
      event.data.type === "hsFormCallback" &&
      event.data.eventName === "onFormSubmit"
    ) {
      var eventIdField = event.data.data.find(function (field) {
        return field.name === "facebook_event_id";
      });
      var submittedEventId = eventIdField.value;

      var emailField = event.data.data.find(function (field) {
        return field.name === "email";
      });
      var submittedEmail = emailField.value;

      rudderanalytics.identify(hashed_user_id, {
        email: submittedEmail,
      });

      rudderanalytics.track("Meeting Booked", {
        form_submission_id: submittedEventId,
        form_id: event.data.id,
      });
    }
  });
}