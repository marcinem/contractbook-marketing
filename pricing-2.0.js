const usdSwitch = document.getElementById("price-usd");
const eurSwitch = document.getElementById("price-eur");
const gbpSwitch = document.getElementById("price-gbp");

function detectLocation() {
  /////// Detect country and change to local currency
  var countryCode = sessionStorage.getItem("clientLoc");
  var usdCountries = ["US", "CA", "IL", "MX"];
  var dkkCountries = ["DK"];
  var gbpCountries = ["GB"];

  if (usdCountries.includes(countryCode)) {
    usdSwitch.click();
  } else if (gbpCountries.includes(countryCode)) {
    gbpSwitch.click();
  } else {
    eurSwitch.click();
  }
}

document.addEventListener("DOMContentLoaded", detectLocation);
