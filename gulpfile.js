    var gulp = require("gulp");
    var fs = require("fs");

    //Webサーバー、ユーティリティ
    var ejs = require("gulp-ejs");
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

    var project = require('./project.json');
    var work;

    for (var name in project) {
        if (project[name] === true) {
            work = name;
        }
    }

    var dir = {
        "src": "_src",
        "dist": "_dist",
        "deploy": "deploy"
    }

    var develop = {
        "data": '_src/_develop/' + work + '/'
    }

    var path = {
        "html": [dir.src + "/**/*.html", "!" + dir.src + "/**/*min.html"],
        "scss": dir.src + "/_develop/" + work + "/**/*.scss",
        "ejs": dir.src + "/_develop/" + work + "/**/*.ejs",
        "ejsbase": dir.src + "/_common/**/*.ejs",
        "css": dir.src + "/deploy/" + work + "/**/*.css",
        "js": [dir.src + "/_develop/" + work + "/**/*.js", dir.src + "/_develop/" + work + "/**/*.json"],
        "jsdep": dir.src + "/deploy/" + work + "/**/*.js",
        "img": [dir.src + "/_develop/" + work + "/**/*.jpg", dir.src + "/_develop/" + work + "/**/*.gif", dir.src + "/_develop/" + work + "/**/*.png"]
    }


    /***********************************************************
    //Webサーバー、ユーティリティ
    ************************************************************/
    gulp.task("server", function() {
        return browser({
            server: {
                baseDir: '_src/deploy/' + work
            }
        });
    });

    gulp.task("copy", function() {
        return gulp.src(
                ['_src/deploy/**/**'], { base: '_src' }
            )
            .pipe(gulp.dest(dir.dist));
    });

    gulp.task("watch", function() {
        gulp.watch(path.ejs, ["ejs", 'lint:html']);
        gulp.watch(path.ejsbase, ["ejs", 'lint:html']);
        gulp.watch(path.scss, ["sass"]);
        gulp.watch(path.js, ["js"]);
    });

    gulp.task("prepare", function(callback) {
        return sequence(
            ['ejs'], ["sass"], ["img"], ['lint:html'], ['watch'],
            callback
        );
    });

    gulp.task("imagemin", function(callback) {
        return sequence(
            ['min:img'],
            callback
        );
    });

    gulp.task("deploy", function(callback) {
        return sequence(
            ['ejs'], ["sass"], ["img"], ['lint:html'], ['min:html', 'min:css', 'min:js'], ['copy'],
            callback
        );
    });

    gulp.task("default", function(callback) {
        return sequence(
            ['prepare'], ['server'],
            callback
        );
    });