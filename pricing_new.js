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

var total;
var totalPriceTag = document.getElementById("calculated-price");

const foundationBaseString = '{"$":"440", "€":"330", "£":"300"}';
const foundationBasePrice = JSON.parse(foundationBaseString);

const lowCRM = ["Google Spreadsheets", "Airtable"];
const mediumCRM = [
  "Pipedrive",
  "Hubspot CRM",
  "Zoho CRM",
  "Zendesk Sell",
  "Monday.com",
  "Active Campaign",
  "Other",
];
const highCRM = ["Salesforce", "Microsoft Dynamics 365"];

/// Inputs for testing

let lowPricesString =
  '{"0-5" : ' +
  '{ "$":300, "€":200, "£":200 },' +
  '"6-15" : ' +
  '{ "$":400, "€":300, "£":300 },' +
  '"15+" : ' +
  '{ "$":600, "€":450, "£":450 }}';
let mediumPricesString =
  '{"0-5" : ' +
  '{ "$":400, "€":300, "£":400 },' +
  '"6-15" : ' +
  '{ "$":500, "€":400, "£":400 },' +
  '"15+" : ' +
  '{ "$":600, "€":450, "£":450 }}';
let highPricesString =
  '{"0-5" : ' +
  '{ "$":500, "€":400, "£":400 },' +
  '"6-15" : ' +
  '{ "$":800, "€":600, "£":600 },' +
  '"15+" : ' +
  '{ "$":1000, "€":800, "£":800 }}';

const lowPrices = JSON.parse(lowPricesString);
const mediumPrices = JSON.parse(mediumPricesString);
const highPrices = JSON.parse(highPricesString);

function findPrice(crmName, templates) {
  if (lowCRM.includes(crmName)) {
    return lowPrices[templates][currency];
  } else if (mediumCRM.includes(crmName)) {
    return mediumPrices[templates][currency];
  } else if (highCRM.includes(crmName)) {
    return highPrices[templates][currency];
  } else {
    return mediumPrices[templates][currency];
  }
}

function calculatePrice() {
  var u = document.getElementById("Users-2");
  u = u.selectedOptions[0].value;

  var uV;
  if (u === "Up to 10") {
    uV = 0;
  } else if (u === "Up to 20") {
    if (currency === "$") {
      uV = 120;
    } else {
      uV = 100;
    }
  } else if (u === "Up to 30") {
    if (currency === "$") {
      uV = 240;
    } else {
      uV = 200;
    }
  } else if (u === "Up to 40") {
    if (currency === "$") {
      uV = 360;
    } else {
      uV = 300;
    }
  } else {
    uV = 0;
  }

  var t = document.getElementById("number-of-sales-contracts");
  t = t.selectedOptions[0].value;

  var c = document.getElementById("CRMs");
  c = c.selectedOptions[0].value;

  total =
    parseInt(foundationBasePrice[currency]) + parseInt(findPrice(c, t)) + uV;
  totalPriceTag.innerText = currency + total;
}

function showPricePerUser() {
  priceTags = document.querySelectorAll(
    ".pricing-table-plan-tile_price > [data-price]"
  );
  priceTags.forEach(function (tag) {
    p = tag.innerText;
    c = p.replace(/[0-9]/g, "");
    b = p.replace(/\D/g, "");
    b = b / 10;

    l = tag.parentNode.lastChild;
    l.innerHTML = "/per user, monthly";
    tag.innerText = c + b;
  });
  d = document.querySelectorAll("[data-info]");
  d.forEach(function (info) {
    info.innerHTML = "Minimum 10 users";
  });
}

function showPricePerTeam() {
  priceTags = document.querySelectorAll(
    ".pricing-table-plan-tile_price > [data-price]"
  );
  priceTags.forEach(function (tag) {
    if (currency === "€") {
      tag.innerHTML = tag.dataset.priceEur;
    } else if (currency === "£") {
      tag.innerHTML = tag.dataset.priceGbp;
    } else if (currency === "$") {
      tag.innerHTML = tag.dataset.priceUsd;
    } else {
      tag.innerHTML = tag.dataset.priceEur;
    }
    l = tag.parentNode.lastChild;
    l.innerHTML = "/per month";
  });
  d = document.querySelectorAll("[data-info]");
  d.forEach(function (info) {
    info.innerHTML = "10 users included";
  });
}

function priceSwitcher() {
  e = document.querySelector(".pricing-tu-switch-component");
  e.addEventListener("click", function (e) {
    u = document.querySelector(".pricing-switch-user");
    if (u.style.opacity == 0.2) {
      showPricePerUser();
    } else {
      showPricePerTeam();
    }
  });
}
document.addEventListener("DOMContentLoaded", calculatePrice);
document.addEventListener("DOMContentLoaded", detectLocation);
document.addEventListener("DOMContentLoaded", priceSwitcher);
