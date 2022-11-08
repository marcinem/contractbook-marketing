// plausible-events.js
// Track Book a Meeting conversions

var cFieldValue,
  countryFieldValue,
  industryFieldValue,
  cField,
  countryField,
  industryField;
window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormReady" &&
    event.data.id === "f7ecd4d4-2c45-44c2-b80e-bce529dbc495"
  ) {
    cField = document.querySelectorAll('[name="0-2/company_size_brackets"]');
    cFieldValue = cField.value;
    cField.forEach((e) => {
      e.addEventListener("change", (event) => {
        cFieldValue = event.target.value;
        // send event to GTM
        dataLayer.push({
          event: "form-company-dropdown-change",
          "hs-form-size": event.target.value,
        });
      });
    });

    countryField = document.querySelectorAll('select[name="country_contact"]');
    countryFieldValue = countryField.value;
    countryField.forEach((e) => {
      e.addEventListener("change", (event) => {
        countryFieldValue = event.target.value;
      });
    });

    industryField = document.querySelectorAll('select[name="industry_bucket"]');
    industryFieldValue = industryField.value;
    industryField.forEach((e) => {
      e.addEventListener("change", (event) => {
        industryFieldValue = event.target.value;
      });
    });
  }
});

window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormSubmit" &&
    event.data.id === "f7ecd4d4-2c45-44c2-b80e-bce529dbc495"
  ) {
    plausible("Meeting Booked", {
      props: {
        Company_Size: cFieldValue,
        Country: countryFieldValue,
        Industry: industryFieldValue,
      },
    });
  }
});

// Track significant PageViews
/* 
• /book-a-meeting
• /pricing
• /request-free-trial
• /customers
• /about-us
*/

window.addEventListener("DOMContentLoaded", function (e) {
  const locationHref = window.location.pathname;
  const regex = new RegExp(
    "/pricing|/book-a-meeting|/request-free-trial|/about-us|/customers/g"
  );
  setTimeout(function () {
    if (regex.test(locationHref)) {
      plausible("Significant PV", {
        props: { Page: "https://contractbook.com" + locationHref },
      });
    }
  }, 3500);
});

// Track gated content access
// 1. Ebook download
window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormSubmit" &&
    event.data.id === "60e2a471-b417-46e5-b3ed-a446998cf2eb"
  ) {
    const locationHref = window.location.pathname;
    plausible("Gated Content Access", {
      props: { Content_type: "Ebook", Content_path: locationHref },
    });
  }
});
// 2. Webinar recording
window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormSubmit" &&
    event.data.id === "16ab0120-b817-4271-8690-abe28fdbfea8"
  ) {
    const locationHref = window.location.pathname;
    plausible("Gated Content Access", {
      props: { Content_type: "Webinar recording", Content_path: locationHref },
    });
  }
});
// 3. Template download
window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormSubmit" &&
    event.data.id === "dd10699a-5df6-4569-82d3-6c149a89943b"
  ) {
    const locationHref = window.location.pathname;
    plausible("Gated Content Access", {
      props: { Content_type: "Template", Content_path: locationHref },
    });
  }
});
