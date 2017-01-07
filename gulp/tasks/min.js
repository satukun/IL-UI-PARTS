'use strict'
var gulp = require('gulp');
var plumber = require('gulp-plumber');
// var csso = require('gulp-csso');
var rename = require('gulp-rename');
// var filter = require('gulp-filter');
var cssmin = require("gulp-cssmin");
var minifyhtml = require("gulp-minify-html");
var prettify = require('gulp-html-prettify');
var uglify = require('gulp-uglify');



/***********************************************************
min
************************************************************/
gulp.task("min:html", function() {
    return gulp.src(path.html)
        .pipe(minifyhtml({ empty: true }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dir.dist))
});

gulp.task("min:css", function() {
    return gulp.src(path.css)
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dir.dist + '/deploy/' + work))
});

gulp.task("min:js", function() {
    return gulp.src(path.jsdep)
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dir.dist + '/deploy/' + work))
});