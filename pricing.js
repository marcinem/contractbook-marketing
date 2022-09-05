var priceItems = document.querySelectorAll("[data-price]");
var currency = "€";

const usdSwitch = document.getElementById("price-usd");
const eurSwitch = document.getElementById("price-eur");
const gbpSwitch = document.getElementById("price-gbp");

const switchers = document.querySelectorAll(".pricing__currency--item");

usdSwitch.addEventListener("click", function (e) {
  switchers.forEach(function (s) {
    s.classList.remove("is--active");
  });
  this.classList.add("is--active");
  SwitchPricesToUsd();
  calculatePrice();
});

gbpSwitch.addEventListener("click", function (e) {
  switchers.forEach(function (s) {
    s.classList.remove("is--active");
  });
  this.classList.add("is--active");
  SwitchPricesToGbp();
  calculatePrice();
});

eurSwitch.addEventListener("click", function (e) {
  switchers.forEach(function (s) {
    s.classList.remove("is--active");
  });
  this.classList.add("is--active");
  SwitchPricesToEur();
  calculatePrice();
});

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
  calculatePrice();
}

function SwitchPricesToUsd() {
  currency = "$";
  priceItems.forEach(function (item) {
    item.innerText = item.dataset.priceUsd;
  });
}

function SwitchPricesToGbp() {
  currency = "£";
  priceItems.forEach(function (item) {
    item.innerText = item.dataset.priceGbp;
  });
}

function SwitchPricesToEur() {
  currency = "€";
  priceItems.forEach(function (item) {
    item.innerText = item.dataset.priceEur;
  });
}

const selectElements = document.querySelectorAll(".select-field");
selectElements.forEach(function (e) {
  e.addEventListener("change", calculatePrice);
});

function calculatePrice() {
  var totalPriceTag = document.getElementById("calculated-price");

  var foundationBase = 330;
  var cX = 1;
  var CRMarray = {
    Airtable: 1,
    "Google Spreadsheets": 1,
    Pipedrive: 1.3333333333333333,
    "Hubspot CRM": 1.3333333333333333,
    Salesforce: 1.6666666666667,
    "Microsoft Dynamics 365": 1.6666666666667,
    None: 0,
  };

  if (currency === "$") {
    // foundationBase = 440;
    // salesBase = 400;
    cX = 1.3333333333333333;
  } else if (currency === "£") {
    // foundationBase = 275;
    // salesBase = 250;
    cX = 0.83333333333333333;
  }

  var u = document.getElementById("Users-2");
  u = u.selectedOptions[0].value;

  var t = document.getElementById("number-of-sales-contracts");
  t = t.selectedOptions[0].value;

  var c = document.getElementById("CRMs");
  c = c.selectedOptions[0].value;

  // map values
  var uV, tV, cV, sV;

  if (u === "Up to 10") {
    uV = 0;
  } else if (u === "Up to 20") {
    uV = 100;
  } else if (u === "Up to 30") {
    uV = 200;
  } else if (u === "Up to 40") {
    uV = 300;
  } else {
    uV = 0;
  }

  // Sales bundle value

  if (
    c === "Pipedrive" ||
    c === "Hubspot CRM" ||
    c === "Zoho CRM" ||
    c === "Zendesk Sell" ||
    c === "Monday.com" ||
    c === "ActiveCampaign" ||
    c === "Other"
  ) {
    if (t === "0-5") {
      sV = 400;
    } else if (t === "6-15") {
      sV = 500;
    } else if (t === "15+") {
      sV = 600;
    } else {
      sV = 400;
    }
  } else if (c === "Airtable" || c === "Google Spreadsheets") {
    if (t === "0-5") {
      sV = 300;
    } else if (t === "6-15") {
      sV = 400;
    } else if (t === "15+") {
      sV = 600;
    } else {
      sV = 300;
    }
  } else if (c === "Salesforce" || c === "Microsoft Dynamics 365") {
    if (t === "0-5") {
      sV = 500;
    } else if (t === "6-15") {
      sV = 800;
    } else if (t === "15+") {
      sV = 1000;
    } else {
      sV = 500;
    }
  } else {
    sV = 0;
  }

  // final calculation
  var totalPrice = cX * (foundationBase + uV + sV);
  totalPrice = Math.round(totalPrice / 5) * 5;
  totalPriceTag.innerText = currency + totalPrice;
}

document.addEventListener("DOMContentLoaded", calculatePrice);
document.addEventListener("DOMContentLoaded", detectLocation);
