var potential_savings_n = document.getElementById("potential_savings_n");
var field_hours_number = document.getElementById('hours_number')
  field_salary = document.getElementById('salary');

var calculate_fields = document.getElementById('calculate-fields');

// Default INIT values
field_hours_number.value = 30;
field_salary.value = 3500;


var savings;

const ROIform = document.getElementById('ROI_hubspot_form')
const requestButton = document.getElementById('ROI_cta')

// number formatter
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function calculateROI() {
  hours = field_hours_number.value;
  salary = field_salary.value;
  
  savings = 12 * hours * salary * 1.83 / 140 * 0.5;
    //Months x Contract Hours x Salary x Social Contributions – fixed modifier / Hours Worked x Time Saved
  var savings_formatted = formatter.format(savings);
  potential_savings_n.innerText = savings_formatted;

  var hs_field_hours = document.querySelector("[name=roi_contract_hours]");
  var hs_field_salary = document.querySelector("[name=roi_monthly_salary]");
  var hs_field_savings = document.querySelector("[name=roi_potential_savings]");

  if(hs_field_hours && hs_field_salary && hs_field_savings) {
    hs_field_hours.value = hours;
    hs_field_salary.value = salary;
    hs_field_savings.value = savings;
  }  
}


function showform() {
  ROIform.style.display = "flex";
  requestButton.style.display = "none";
  calculate_fields.style.display = "none";
}

field_hours_number.addEventListener('input', calculateROI);
field_salary.addEventListener('input', calculateROI);
requestButton.addEventListener('click', showform);

calculateROI();