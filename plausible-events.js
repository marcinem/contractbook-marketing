// plausible-events.js
// Track Book a Meeting conversions

var cFieldValue, countryFieldValue, industryFieldValue;
window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormReady" &&
    event.data.id === "f7ecd4d4-2c45-44c2-b80e-bce529dbc495"
  ) {
    var cField = document.querySelector('[name="0-2/company_size_brackets"]');
    cFieldValue = cField.options[cField.selectedIndex].innerText;
    cField.addEventListener("change", function () {
      cFieldValue = cField.options[cField.selectedIndex].innerText;
    });

    var countryField = document.querySelector('[name="country_contact"]');
    countryFieldValue = countryField.options[countryField.selectedIndex].innerText;
    countryField.addEventListener("change", function () {
      countryFieldValue = countryField.options[countryField.selectedIndex].innerText;
    });

    var industryField = document.querySelector('[name="industry_bucket"]');
    industryFieldValue = industryField.options[industryField.selectedIndex].innerText;
    industryField.addEventListener("change", function () {
      industryFieldValue = industryField.options[industryField.selectedIndex].innerText;
    });
  }
});

window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormSubmit" &&
    event.data.id === "f7ecd4d4-2c45-44c2-b80e-bce529dbc495"
  ) {
    cFieldValue = cField.options[cField.selectedIndex].innerText;
    countryFieldValue = countryField.options[countryField.selectedIndex].innerText;
    industryFieldValue = industryField.options[industryField.selectedIndex].innerText;
  }
});

window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormSubmitted" &&
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

window.addEventListener("DOMContentLoaded", function(e) {
    const locationHref = window.location.pathname;
    const regex = (new RegExp('/pricing|/book-a-meeting|/request-free-trial|/about-us|/customers/g'))

    if (regex.test(locationHref)) {
        plausible('Significant PV', {props: {Page: 'https://contractbook.com'+locationHref}});
    }
})