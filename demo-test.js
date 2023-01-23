// read params from URL

const url = window.location.search;
const params = new URLSearchParams(url);

const companyName = params.get("companyName");
const companySize = params.get("Employees");
const companyIndustry = params.get("Industry");

window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormReady"
  ) {
    if (companyName && companySize && companyIndustry)
      console.log(companyName, companySize, companyIndustry);
    fillFromURL(companySize, companyName, companyIndustry);
  }

  function fillFromURL(companySize, companyName, companyIndustry) {
    nameField = document.querySelector("[name='company']");
    sizeField = document.querySelector("[name='0-2\\/company_size_brackets']");
    industryField = document.querySelector("[name='industry_bucket']");

    nameField.value = companyName;
    nameField.dispatchEvent(new Event("input", { bubbles: true }));

    sizeField.value = companySize;
    sizeField.dispatchEvent(new Event("input", { bubbles: true }));

    industryField.value = companyIndustry;
    industryField.dispatchEvent(new Event("input", { bubbles: true }));

    nameFieldWrapper = document.querySelector(".hs_company");
    sizeFieldWrapper = document.querySelector(
      ".hs_0-2\\/company_size_brackets",
    );
    industryFieldWrapper = document.querySelector(".hs_industry_bucket");

    nameFieldWrapper.style.display = "none";
    sizeFieldWrapper.style.display = "none";
    industryFieldWrapper.style.display = "none";
  }
});
