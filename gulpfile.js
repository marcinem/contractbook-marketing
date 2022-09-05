// ---------------------------------------- Gulp modules
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
const path = require("path");
// const less = require('gulp-less');
// const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");

// const jsfiles = [
//     './scripts.js',
//     './utm-tracker.js',
//     './form-trackers.js',
//     './uptimer-status.js'
// ]

function pricingjs() {
  return gulp
    .src("./pricing.js")
    .pipe(concat("pricing.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/"));
}
// ---------------------------------------- Taks

gulp.task("pricingjs", pricingjs);

gulp.task("default", gulp.parallel(pricingjs));
