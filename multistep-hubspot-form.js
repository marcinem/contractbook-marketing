// Edit the configuration then copy paste intro <script> tags
///    portalId: "4811794",
// formId: "29d7b61e-e1f0-4b55-a3f7-8cbc7f5f4157" - Test form - https://app.hubspot.com/forms/4811794/editor/29d7b61e-e1f0-4b55-a3f7-8cbc7f5f4157
//"f7ecd4d4-2c45-44c2-b80e-bce529dbc495",
const forms = [
    "29d7b61e-e1f0-4b55-a3f7-8cbc7f5f4157",
    "f7ecd4d4-2c45-44c2-b80e-bce529dbc495",
];
var portalId = '4811794';
var target = '#multistep-form';

// No need to worry about stuff below this point
var data = [];
var options = [];

const generateFormOptions = (form, index) => {
    return {
        portalId,
        formId: form,
        target,
        onFormReady: function(form) {
            if (index !== 0) {
                form.find('input[name="email"]').val(data[0][1].value).change();
            }
        },
        onFormSubmit: function(form) {
            if (data.length === 0) {
                const incoming = $(form).serializeArray();

                data.push(incoming);
               
            }
        },
        onFormSubmitted: function() {
            if (index !== forms.length - 1) {
                console.log(data[0]);

                var company_size = data[0].find(({ name }) => name === "0-2/company_size_brackets");
                company_size = company_size.value;
                
                console.log(company_size);
                // $(target).empty();
                if(company_size === "1-10") {
                    $( "#multistep-form" ).empty();
                    $( "#multistep-form" ).append('company is too small. We can show whatever we want here.')
                } else {
                    hbspt.forms.create(options[index + 1]);
                }
            }
        }
    }
}

const multiStepForm = () => {
    forms.forEach((form, index) => {
        options.push(generateFormOptions(form, index));
    })
    hbspt.forms.create(options[0]);
}


multiStepForm();

// function defer() {
//     if (window.jQuery) {
//         multiStepForm();
//         console.log('ready')
//     } else {
//         setTimeout(function() { defer() }, 50);
//     }
// }

// defer();