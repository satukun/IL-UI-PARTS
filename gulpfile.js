    var gulp = require("gulp");
    var fs = require("fs");

    //html
    var htmlhint = require("gulp-htmlhint");
    var minifyhtml = require("gulp-minify-html");
    var prettify = require('gulp-html-prettify');

    //css
    var cssmin = require("gulp-cssmin");
    var sass = require("gulp-sass");
    var csslint = require("gulp-csslint");
    var csscomb = require("gulp-csscomb");
    var autoprefixer = require("gulp-autoprefixer");

    //js
    var concat = require("gulp-concat");
    var uglify = require('gulp-uglify');

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

    // ファイル操作
    var rename = require("gulp-rename");

    // 画像
    var imagemin = require("gulp-imagemin");
    var resize = require("gulp-image-resize");
    var pngquant = require('imagemin-pngquant');

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
        "js": dir.src + "/_develop/" + work + "/**/*.js",
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

    gulp.task("html", function() {
        return gulp.src(path.html)
            .pipe(changed(dir.src))
            .pipe(gulp.dest(dir.src))
            .pipe(browser.reload({
                stream: true
            }))
    });

    gulp.task("sass", function() {
        return gulp.src(path.scss)
            .pipe(changed(dir.src + '/deploy/' + work))
            .pipe(plumber({
                errorHandler: notify.onError('SCSSでError出てまっせ: <%= error.message %>')
            }))
            .pipe(sass({ outputStyle: 'expanded' }))
            .pipe(autoprefixer({
                browsers: ['last 2 versions', "ie 8", "ie 7"],
                cascade: false
            }))
            .pipe(csscomb())
            .pipe(gulp.dest(dir.src + '/deploy/' + work))
            .pipe(browser.reload({
                stream: true
            }))
    });

    gulp.task("img", function() {
        return gulp.src(path.img)
            .pipe(gulp.dest(dir.src + '/deploy/' + work))
    });

    gulp.task("js", function() {
        browserify({
                entries: [
                    '_src/_develop/work/js/names.js',
                    '_src/_develop/work/js/action.js',
                    '_src/_develop/work/js/style.js'
                ]
            })
            .bundle()
            .pipe(source('main.js'))
            .pipe(gulp.dest(dir.src + '/deploy/' + work + '/js'))
            .pipe(browser.reload({
                stream: true
            }))
    });

    /***********************************************************
    lint
    ************************************************************/
    gulp.task("lint:html", function() {
        gulp.src(path.html)
            .pipe(plumber({
                errorHandler: notify.onError('HTMLでError出てまっせ: <%= error.message %>')
            }))
            .pipe(htmlhint('.htmlhintrc'))
            .pipe(htmlhint.reporter());
    });

    gulp.task("lint:css", function() {
        gulp.src(path.css)
            .pipe(plumber({
                errorHandler: notify.onError('CSSでError出てまっせ: <%= error.message %>')
            }))
            .pipe(csslint('.csslintrc'))
            .pipe(csslint.formatter());
    });

    gulp.task("lint:js", function() {
        return gulp.src(path.js)
            .pipe(plumber({
                errorHandler: notify.onError('JSでError出てまっせ: <%= error.message %>')
            }))
            .pipe(eslint({ useEslintrc: true }))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError())
            .pipe(plumber.stop());
    });


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

    gulp.task("min:img", function() {
        gulp.src(path.img)
            .pipe(imagemin({
                use: [pngquant()]
            }))

        gulp.src(path.img)
            .pipe(imagemin({
                progressive: true
            }))
    });


    /***********************************************************
    ejs
    ************************************************************/
    gulp.task("ejs", function() {
        return gulp.src(path.ejs)
            .pipe(changed(dir.src + '/deploy/' + work + '/'))
            .pipe(plumber({
                errorHandler: notify.onError('ejsでError出てまっせ: <%= error.message %>')
            }))
            .pipe(ejs({
                site: JSON.parse(fs.readFileSync(develop.data + 'site.json'))
            }, { "ext": ".html" }))
            .pipe(prettify({ indent_char: ' ', indent_size: 2 }))
            .pipe(gulp.dest(dir.src + '/deploy/' + work + '/'))
            .pipe(browser.reload({
                stream: true
            }))
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
            ['ejs'], ["sass"], ["js", "img"], ['lint:html'], ['watch'],
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
            ['ejs'], ["sass"], ["js", "img"], ['lint:html'], ['min:html', 'min:css', 'min:js'], ['copy'],
            callback
        );
    });

    gulp.task("default", function(callback) {
        return sequence(
            ['prepare'], ['server'],
            callback
        );
    });