(function () {
  window.VWO = window.VWO || [];
  window.VWO.push([
    "onVariationApplied",
    function (data) {
      if (!data) {
        return;
      }
      var expId = data[1],
        variationId = data[2];
      if (
        typeof _vwo_exp[expId].comb_n[variationId] !== "undefined" &&
        _vwo_exp[expId].GTM
      ) {
        console.log({
          CampaignId: expId,
          CampaignName: _vwo_exp[expId].name,
          VariationId: variationId,
          VariationName: _vwo_exp[expId].comb_n[variationId],
        });
      }
    },
  ]);
})();
