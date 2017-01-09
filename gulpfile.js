'use strict'
var gulp = require("gulp");
var fs = require("fs");

//Webサーバー、ユーティリティ
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var notifier = require('node-notifier');
var sequence = require('gulp-sequence');
var changed = require('gulp-changed');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var requireDir = require('require-dir');
requireDir('./gulp/tasks', { recurse: true });

// --------------------------------------------------------
var f = require('./gulp/path');
f = f.func();
// --------------------------------------------------------

gulp.task("server", function() {
    return browser({
        server: {
            baseDir: '_src/deploy/' + f.work
        }
    });
});

gulp.task("copy", function() {
    return gulp.src(
            ['_src/deploy/**/**'], { base: '_src' }
        )
        .pipe(gulp.dest(f.dir.dist));
});

gulp.task("watch", function() {
    gulp.watch(f.path.ejs, ["replace:pc", 'lint-html:pc']);
    gulp.watch(f.path.ejsbase, ["replace:pc", 'lint-html:pc']);
    gulp.watch(f.path.scss, ["css-build:pc"]);
    gulp.watch(f.path.js, ["js"]);
});

gulp.task("prepare", function(callback) {
    return sequence(
        ['replace:pc'], ['css-build:pc'], ['lint-html:pc', 'lint-css:pc', 'lint-js:pc'],
        callback
    );
});

gulp.task("image", function(callback) {
    return sequence(
        ['sprite:pc', 'img:pc'],
        callback
    );
});

gulp.task("deploy", function(callback) {
    return sequence(
        ['replace:pc'], ['css-build:pc'], ['min-html:pc', 'min-css:pc', 'min-js:pc'], ['sprite:pc', 'img:pc'], ['copy'],
        callback
    );
});

gulp.task("default", function(callback) {
    return sequence(
        ['prepare'], ['server'], ['watch'],
        callback
    );
});