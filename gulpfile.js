// ---------------------------------------- Gulp modules
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
const path = require("path");
const less = require("gulp-less");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

// const jsfiles = [
//     './scripts.js',
//     './utm-tracker.js',
//     './form-trackers.js',
//     './uptimer-status.js'
// ]

const jsfiles = [
  "./scripts.js",
  "./utm-tracker-2.0.js",
  "./form-trackers-2.0.js",
  "./plausible-events.js"
];

const cssfiles = ["./_less/style.less"];
// ---------------------------------------- JS
function js() {
  return gulp
    .src(jsfiles)
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./__dist/"));
}

// function newutms() {
//   return gulp
//     .src("./utm-tracker-2.0.js")
//     .pipe(concat("newutms.min.js"))
//     .pipe(uglify())
//     .pipe(gulp.dest("./__dist/"));
// }

// function newpricing() {
//   return gulp
//     .src("./pricing_new.js")
//     .pipe(concat("pricing.min.js"))
//     .pipe(uglify())
//     .pipe(gulp.dest("./dist/"));
// }

// function newformtrackers() {
//   return gulp
//     .src("./form-trackers-2.0.js")
//     .pipe(concat("newforms.min.js"))
//     .pipe(uglify())
//     .pipe(gulp.dest("./__dist/"));
// }

// function demoTest() {
//   return gulp
//     .src("./demo-test.js")
//     .pipe(concat("demo-test.min.js"))
//     .pipe(uglify())
//     .pipe(gulp.dest("./__dist/"));
// }
// function vwoTracking() {
//   return gulp
//     .src("./vwo-tracking.js")
//     .pipe(concat("vwo-tracking.min.js"))
//     .pipe(uglify())
//     .pipe(gulp.dest("./__dist/"));
// }
// ---------------------------------------- CSS
function css() {
  return gulp
    .src(cssfiles)
    .pipe(plumber())
    .pipe(
      less({
        paths: [path.join(__dirname, "less", "includes")],
      }),
    )
    .pipe(autoprefixer("last 8 versions"))
    .pipe(cleanCSS())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("./__dist/"));
}
// ---------------------------------------- Watch
function watchFiles() {
  gulp.watch("./_less/**/*.less", css);
  gulp.watch("./*.js", js);
}
// ---------------------------------------- Taks
gulp.task(
  "default",
  gulp.parallel(
    js,
    css,
    watchFiles,
  ),
);
