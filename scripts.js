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