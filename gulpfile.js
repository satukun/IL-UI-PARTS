'use strict'
var gulp = require("gulp");
var fs = require("fs");
var path = require('path');
var del = require('del');

//Webサーバー、ユーティリティ
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var notifier = require('node-notifier');
var sequence = require('gulp-sequence');
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
    gulp.watch(f.path.ejs, ["replaceEjs:pc", 'lint-html:pc']);
    gulp.watch(f.path.ejsbase, ["replaceEjs:pc", 'lint-html:pc']);
    gulp.watch(f.path.scss, ["css-build:pc", 'lint-css:pc']);
    gulp.watch(f.path.img, ['image']);
    gulp.watch(f.path.sprites, ['image']);

});

gulp.task("prepare", function(callback) {
    return sequence(
        ['replaceEjs:pc'], ['clean:img'], ['sprite:pc'], ['img:pc'], ['css-build:pc'], ['lint-html:pc', 'lint-css:pc'],
        callback
    );
});

gulp.task("deploy", function(callback) {
    return sequence(
        ['clean:dist'], ['clean:img'], ['sprite:pc'], ['img:pc'], ['min-html:pc', 'min-css:pc', 'min-js:pc'], ['replaceFile:pc'], ['replaceHtml:pc'],
        callback
    );
});

gulp.task("default", function(callback) {
    return sequence(
        ['prepare'], ['server'], ['watch'],
        callback
    );
});

gulp.task("image", function(callback) {
    return sequence(
        ['clean:img'], ['sprite:pc'], ['img:pc'],
        callback
    );
});