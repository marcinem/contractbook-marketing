$(".pricing__currency--item").click(function () {
  $(".pricing__currency--item").removeClass("is--active");
  $(this).addClass("is--active");
});

const switchUsd = document.getElementById('price-usd');
const switchEur = document.getElementById('price-eur');
const switchGbp = document.getElementById('price-gbp');

function SwitchPricesToEur() {
  switchEur.click()
}

function SwitchPricesToUsd() {
  switchUsd.click()
}

function SwitchPricesToGbp() {
  switchGbp.click()
}
/////// Detect country and change to local currency
var countryCode = sessionStorage.getItem('clientLoc');
var usdCountries = ["US", "CA", "IL", "MX"];
var dkkCountries = ["DK"];
var gbpCountries = ["GB"];

if (usdCountries.includes(countryCode)) {
  SwitchPricesToUsd();     
} else if (gbpCountries.includes(countryCode)) {
	SwitchPricesToGbp();
}
else {
  SwitchPricesToEur();
};
/////// End of detect country


$(document).ready(function() {
  if (window.location.href.indexOf("#compare") > -1) {
    $('.c-pricing-forb-compare')[0].click();
  }
});

