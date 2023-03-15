// scripts.js

window.addEventListener("load", function () {
    $(".is--book").wrap("<a class='is--book-a'></a>");
    $(".is--book-a").attr(
      "href",
      "https://contractbook.com/book-a-meeting-now-2"
    );
  });

  $(".pricing__currency--item").click(function () {
    $(".pricing__currency--item").removeClass("is--active");
    $(this).addClass("is--active");
  });

  function slider1() {
    let splides = $(".splide");
    for (let i = 0, splideLength = splides.length; i < splideLength; i++) {
      new Splide(splides[i], {
        // Desktop on down
        perPage: 3,
        perMove: 1,
        focus: 0, // 0 = left and 'center' = center
        type: "slide", // 'loop' or 'slide'
        gap: "7.29em", // space between slides
        arrows: "slider", // 'slider' or false
        pagination: "slider", // 'slider' or false
        speed: 600, // transition speed in miliseconds
        dragAngleThreshold: 60, // default is 30
        autoWidth: true, // for cards with differing widths
        rewind: false, // go back to beginning when reach end
        rewindSpeed: 400,
        type: "loop",
        drag: "free",
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: false, // true removes empty space from end of list
        breakpoints: {
          991: {
            // Tablet
            perPage: 2,
            gap: "3vw"
          },
          767: {
            // Mobile Landscape
            perPage: 1,
            gap: "3vw"
          },
          479: {
            // Mobile Portrait
            perPage: 1,
            gap: "3vw"
          }
        }
      }).mount();
    }
  }
  slider1();

  // $("a.nav__item, a.nav__logo, .nav__main-btn a.main-btn--small, a.nav__drop--item, a.request__logo").click(function (e) {
  //   e.preventDefault();
  //   var goTo = this.getAttribute("href");

  //   setTimeout(function () {
  //     window.location = goTo;
  //   }, 1050);
  // });

//------------------------------------------------------------------------------------------------ Multistep hubspot interactions

// --------------------------------------------------------------- Function Change labels in HubSpot form
function msfLabels() {
  const labels = document.querySelectorAll(".multi-step-form .hbspt-form label > span");
  labels.forEach((label) => {
    var text = label.innerHTML;
    text = text.replace("First name", "1. What is your first name?");
    text = text.replace("Last name", "2. What is your last name?");
    text = text.replace("Email", "3. What is your email?");
    text = text.replace("Country", "4. What is your country?");
    text = text.replace("Phone number", "5. What is your phone number?");
    label.innerHTML = text;
  });
}

// --------------------------------------------------------------- Funtion Add check mark when input is filled
function msfIntearaction(fields) {
  fields.forEach((field) => {
    // const checkmark = field.querySelector('.image-size_1');
    // const label = field.querySelector('label');
    const inputs = field.querySelectorAll('input');
    inputs.forEach((input) => {
      if (input.type === "text") {
        input.addEventListener("blur", () => {
          if (input.value !== "") {
            field.classList.add("filled");
          } else {
            field.classList.remove("filled");
          }
        });
      } else if (input.name === "email") {
        input.addEventListener("blur", () => {
          if (input.value !== "") {
            field.classList.add("filled");
          } else {
            field.classList.remove("filled");
          }
        });
      } else {
        input.addEventListener("change", () => {
          if (input.value !== "") {
            field.classList.add("filled");
          } else {
            field.classList.remove("filled");
          }
        });
      }
    });
    const select = field.querySelector('#country_contact-f7ecd4d4-2c45-44c2-b80e-bce529dbc495');
    if(select) {
      select.addEventListener("change", () => {
        if (select.selectedIndex !== 0) {
          field.classList.add("filled");
        } else {
          field.classList.remove("filled");
        }
      });
    }
  });
}
// --------------------------------------------------------------- Function Check Validation
function msfValidationCheck(){
  function monitorClassAdded(element) {
    if (!element.classList.contains('error')) {
      window.setTimeout(function() {
        monitorClassAdded(element);
      }, 500);
      return;
    }
    let parent = element.parentElement;
    while (parent !== null && !parent.classList.contains("hs-form-field")) {
      parent = parent.parentElement;
    }
    if (parent !== null) {
      parent.classList.remove('filled');
      console.log('filled removed');
    }
  }
  const emailField = document.querySelector('.multi-step-form .hbspt-form #email-f7ecd4d4-2c45-44c2-b80e-bce529dbc495');
  if(emailField) {
    emailField.addEventListener('blur', () => {
      monitorClassAdded(emailField);
    });
  }
  const phoneField = document.querySelector('.multi-step-form .hbspt-form #phone-f7ecd4d4-2c45-44c2-b80e-bce529dbc495');
  if(phoneField) {
    phoneField.addEventListener('blur', () => {
      monitorClassAdded(phoneField);
    });
  }

}
// --------------------------------------------------------------- Fire up
const fields = document.querySelectorAll(".field_msf");
msfIntearaction(fields);

window.addEventListener('message', event => {
  if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
    const hbfields = document.querySelectorAll(".multi-step-form .hbspt-form .hs-form-field");
    msfLabels();
    msfIntearaction(hbfields);
    msfValidationCheck();
    console.log('form loded');
  }
});
