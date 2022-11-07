const usdSwitch = document.getElementById("price-usd");
const eurSwitch = document.getElementById("price-eur");
const gbpSwitch = document.getElementById("price-gbp");

function detectLocation() {
  /////// Detect country and change to local currency
  var countryCode = sessionStorage.getItem("clientLoc");
  var euCountries = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","EU","IS","LI","NO","CH"];
  var gbpCountries = ["GB"];

  if (euCountries.includes(countryCode)) {
    eurSwitch.click();
  } else if (gbpCountries.includes(countryCode)) {
    gbpSwitch.click();
  } else {
    usdSwitch.click();
  }
}

document.addEventListener("DOMContentLoaded", detectLocation);