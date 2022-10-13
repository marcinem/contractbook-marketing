(function (document) {
  var referrer = document.referrer;
  var gaReferral = {
    source: "(direct)",
    medium: "(none)",
    campaign: "(not set)",
  };
  var thisHostname = document.location.hostname;
  var thisDomain = getDomain_(thisHostname);
  var referringDomain = getDomain_(document.referrer);
  var sessionCookie = getCookie_("__utmzzses");
  var cookieExpiration = new Date(+new Date() + 1000 * 60 * 60 * 24 * 3); //3 days
  var qs = document.location.search.replace("?", "");
  var hash = document.location.hash.replace("#", "");
  var gaParams = parseGoogleParams(qs + "#" + hash); // Default UTM params
  var referringInfo = parseGaReferrer(referrer);
  var storedVals = getCookie_("__utmz") || getCookie_("__utmzz");
  var newCookieVals = {};
  var keyMap = {
    utm_source: "source",
    utm_medium: "medium",
    utm_campaign: "campaign",
    utm_content: "content",
    utm_term: "term",
    gclid: "utmgclid",
    dclid: "utmdclid",
    hsa_cam: "adcampaignid",
    hsa_grp: "adsetid",
    hsa_ad: "ad_id",
    // ad_campaign_id: "adcampaignid",
    // ad_group_id: "adsetid",
    // ad_id: "ad_id",
    // ad_placement: "ad_placement",
    // ad_platform: "ad_platform",
  };
  var keyFilter = [
    "source",
    "medium",
    "campaign",
    "content",
    "term",
    "adcampaignid",
    "adsetid",
    "ad_id",
    "utmgclid",
    "utmdclid",
    // "ad_placement",
    // "ad_platform",
  ];
  var keyName, values, _val, _key, raw, key, len, i;
  if (sessionCookie && referringDomain === thisDomain) {
    gaParams = null;
    referringInfo = null;
  }

  // Checks 
  if (gaParams && (gaParams.utm_source || gaParams.gclid || gaParams.dclid)) {
    for (key in gaParams) {
      if (typeof gaParams[key] !== "undefined") {
        keyName = keyMap[key];
        gaReferral[keyName] = gaParams[key];
      }
    }
    if (gaParams.gclid || gaParams.dclid) {
      gaReferral.source = "google";
      gaReferral.medium = gaReferral.utmgclid ? "cpc" : "cpm";
    }
  } else if (referringInfo) {
    gaReferral.source = referringInfo.source;
    gaReferral.medium = referringInfo.medium;
    if (referringInfo.term) gaReferral.term = referringInfo.term;
  } else if (storedVals) {
    values = {};
    raw = storedVals.split("|");
    len = raw.length;
    for (i = 0; i < len; i++) {
      _val = raw[i].split("=");
      _key = _val[0].split(".").pop();
      values[_key] = _val[1];
    }
    gaReferral = values;
  }
  for (key in gaReferral) {
    if (typeof gaReferral[key] !== "undefined" && keyFilter.indexOf(key) > -1) {
      newCookieVals = {
        ...newCookieVals,
        [key]: gaReferral[key],
      };
    }
  }
  if (!getCookie_("utm")) {
    const cookie = JSON.stringify(newCookieVals);
    writeCookie_("utm", cookie, cookieExpiration, "/", thisDomain);
  }
  writeCookie_("__utmzzses", 1, null, "/", thisDomain);
  // Parsing for default UTM Params
  function parseGoogleParams(str) {
    var campaignParams = ["source", "medium", "campaign", "term", "content"];
    var regex = new RegExp(
      "(utm_(" +
        campaignParams.join("|") +
        ")|(d|g)clid)=.*?([^&#]*|$)" +
        "|(hsa_cam|hsa_grp|hsa_ad)=.*?([^&#]*|$)",
      "gi"
    );
    var gaParams = str.match(regex);
    var paramsObj, vals, len, i;
    if (gaParams) {
      paramsObj = {};
      len = gaParams.length;
      for (i = 0; i < len; i++) {
        vals = gaParams[i].split("=");
        if (vals) {
          paramsObj[vals[0]] = vals[1];
        }
      }
    }
    return paramsObj;
  }
  
  // Parsing Referrer from document
  // Sets UTM for organic search traffic OR Referral
  // Sets referringInfo variable
  function parseGaReferrer(referrer) {
    if (!referrer) return;
    var searchEngines = {
      "daum.net": {
        p: "q",
        n: "daum",
      },
      "eniro.se": {
        p: "search_word",
        n: "eniro ",
      },
      "naver.com": {
        p: "query",
        n: "naver ",
      },
      "yahoo.com": {
        p: "p",
        n: "yahoo",
      },
      "msn.com": {
        p: "q",
        n: "msn",
      },
      "bing.com": {
        p: "q",
        n: "live",
      },
      "aol.com": {
        p: "q",
        n: "aol",
      },
      "lycos.com": {
        p: "q",
        n: "lycos",
      },
      "ask.com": {
        p: "q",
        n: "ask",
      },
      "altavista.com": {
        p: "q",
        n: "altavista",
      },
      "search.netscape.com": {
        p: "query",
        n: "netscape",
      },
      "cnn.com": {
        p: "query",
        n: "cnn",
      },
      "about.com": {
        p: "terms",
        n: "about",
      },
      "mamma.com": {
        p: "query",
        n: "mama",
      },
      "alltheweb.com": {
        p: "q",
        n: "alltheweb",
      },
      "voila.fr": {
        p: "rdata",
        n: "voila",
      },
      "search.virgilio.it": {
        p: "qs",
        n: "virgilio",
      },
      "baidu.com": {
        p: "wd",
        n: "baidu",
      },
      "alice.com": {
        p: "qs",
        n: "alice",
      },
      "yandex.com": {
        p: "text",
        n: "yandex",
      },
      "najdi.org.mk": {
        p: "q",
        n: "najdi",
      },
      "seznam.cz": {
        p: "q",
        n: "seznam",
      },
      "search.com": {
        p: "q",
        n: "search",
      },
      "wp.pl": {
        p: "szukaj ",
        n: "wirtulana polska",
      },
      "online.onetcenter.org": {
        p: "qt",
        n: "o*net",
      },
      "szukacz.pl": {
        p: "q",
        n: "szukacz",
      },
      "yam.com": {
        p: "k",
        n: "yam",
      },
      "pchome.com": {
        p: "q",
        n: "pchome",
      },
      "kvasir.no": {
        p: "q",
        n: "kvasir",
      },
      "sesam.no": {
        p: "q",
        n: "sesam",
      },
      "ozu.es": {
        p: "q",
        n: "ozu ",
      },
      "terra.com": {
        p: "query",
        n: "terra",
      },
      "mynet.com": {
        p: "q",
        n: "mynet",
      },
      "ekolay.net": {
        p: "q",
        n: "ekolay",
      },
      "rambler.ru": {
        p: "words",
        n: "rambler",
      },
      google: {
        p: "q",
        n: "google",
      },
    };
    var a = document.createElement("a"); // Why?
    var values = {};
    var searchEngine, termRegex, term;
    a.href = referrer;
    // Shim for the billion google search engines
    if (a.hostname.indexOf("google") > -1) { 
      referringDomain = "google";
    }
    if (searchEngines[referringDomain]) {
      searchEngine = searchEngines[referringDomain];
      termRegex = new RegExp(searchEngine.p + "=.*?([^&#]*|$)", "gi");
      term = a.search.match(termRegex);
      values.source = searchEngine.n;
      values.medium = "organic";
      values.term = (term ? term[0].split("=")[1] : "") || "(not provided)";
    } else if (referringDomain !== thisDomain) {
      values.source = a.hostname;
      values.medium = "referral";
    }
    return values;
  }
  // Creates cookie
  function writeCookie_(name, value, expiration, path, domain) {
    var str = name + "=" + value + ";";
    if (expiration) str += "Expires=" + expiration.toGMTString() + ";";
    if (path) str += "Path=" + path + ";";
    if (domain) str += "Domain=" + domain + ";";
    document.cookie = str;
  }
  // Reads cookie
  function getCookie_(name) {
    var cookies = "; " + document.cookie;
    var cvals = cookies.split("; " + name + "=");
    if (cvals.length > 1) return cvals.pop().split(";")[0];
  }
  // Parses visit domain + reffering domain
  function getDomain_(url) {
    if (!url) return;
    var a = document.createElement("a"); //Why? Save initial URL in fake element, then parses from there
    a.href = url;
    try {
      return a.hostname.match(/[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/)[0];
    } catch (squelch) {}
  }
})(document);
