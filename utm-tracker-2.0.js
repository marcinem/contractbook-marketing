//utm-tracker-2.0.js
(function readUtms() {
  // global variables
  var cookieExpiration = new Date(+new Date() + 1000 * 60 * 60 * 24 * 3); //3 days
  var thisDomain = document.location.hostname;
  var thisUrl = document.location.href;

  if (document.referrer) {
    var cleanedReferrer = new URL(document.referrer).hostname;
  }
  // Fetch data from URL params
  // for testing only: fixed string
  var params = [];
  var search = location.search.substring(1);
  if (search !== "") {
    params = JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
  }
  params["timestamp"] = Date.now();

  /* THIS IS CORE FUNCTION WHERE THE COOKIE IS SAVED*/
  // function to write the cookie

  if (!Cookies.get("__utm")) {
    constructValues_(params);
    const cookie = JSON.stringify(params);
    Cookies.set("__utm", cookie, {
      path: "/",
      domain: ".contractbook.com",
      expires: cookieExpiration,
    });
  }

  // function to construct the cookie value
  // TODO: Add search engine domains

  function constructValues_(params) {
    if (params.utm_source) return;
    console.log(thisUrl);
    if (thisUrl.indexOf("/lp/") > -1 && cleanedReferrer != thisDomain) {
      params["utm_source"] = cleanedReferrer;
      params["utm_medium"] = "cpc";
      return;
    }
    if (document.referrer) {
      var searchEngineDomains = [
        "google.",
        "bing.",
        "baidu.",
        "yahoo.",
        "ask.",
        "duckduckgo.",
        "msn.",
      ];
      var searchEngineFound = false;
      var i = 0;
      while (!searchEngineFound && i < searchEngineDomains.length) {
        searchEngineFound = cleanedReferrer.includes(searchEngineDomains[i]);
        i++;
      }
      if (searchEngineFound) {
        params["utm_source"] = cleanedReferrer;
        params["utm_medium"] = "organic";
      } else if (cleanedReferrer != thisDomain) {
        params["utm_source"] = cleanedReferrer;
        params["utm_medium"] = "referral";
      }
    } else {
      params["utm_source"] = "(direct)";
      params["utm_medium"] = "(none)";
      params["utm_campaign"] = "(not set)";
    }
  }

  if (params.gclid) {
    sessionStorage.setItem("gclid", params.gclid);
  }
})();
