    var gulp = require("gulp");
    var fs = require("fs");
    //html
    var htmlhint = require("gulp-htmlhint");
    var minifyhtml = require("gulp-minify-html");

    //css
    var cssmin = require("gulp-cssmin");
    var sass = require("gulp-sass");

    //Webサーバー、ユーティリティ
    var ejs = require("gulp-ejs");
    var browser = require("browser-sync");
    var plumber = require("gulp-plumber");
    var notify = require("gulp-notify");
    var notifier = require('node-notifier');
    var sequence = require('gulp-sequence');

    // ファイル操作
    var rename = require("gulp-rename");

    // 画像
    var imagemin = require("gulp-imagemin");
    var resize = require("gulp-image-resize");
    var pngquant = require('imagemin-pngquant');

    // --------------------------------------------------------

    var dir = {
        "src": "_src",
        "dist": "_dist",
        "deploy": "deploy"
    }

    var develop = {
        "data": '_src/_develop/project--a/'
    }

    var path = {
        "html": [dir.src + "/**/*.html", "!" + dir.src + "/**/*min.html", "!" + dir.src + "/**/_*.html"],
        "scss": dir.src + "/_develop/**/*.scss",
        "scssbase": dir.src + "/_common/**/*.scss",
        "ejs": dir.src + "/_develop/**/*.ejs",
        "ejsbase": dir.src + " /_common/**/*.ejs",
        "css": [dir.src + "/_develop/**/*.css", "!" + dir.src + "/_develop/**/*min.css"],
        "js": [dir.src + "/_develop/**/*.js", "!" + dir.src + "/_develop/**/*min.js"],
        "img": [dir.src + "/_develop/**/*.jpg", dir.src + "/_develop/**/*.gif", dir.src + "/_develop/**/*.png"]
    }


    /***********************************************************
    //Webサーバー、ユーティリティ
    ************************************************************/
    gulp.task("server", function() {
        return browser({
            server: {
                baseDir: '_src/deploy'
            }
        });
    });

    gulp.task("html", function() {
        return gulp.src(path.html)
            .pipe(gulp.dest(dir.src))
            .pipe(browser.reload({
                stream: true
            }))
    });

    gulp.task("sass", function() {
        return gulp.src(path.scss)
            .pipe(plumber({
                errorHandler: notify.onError('SCSSでError出てまっせ: <%= error.message %>')
            }))
            .pipe(sass({ outputStyle: 'expanded' }))
            .pipe(gulp.dest(dir.src + '/deploy'))
            .pipe(browser.reload({
                stream: true
            }))
    });

    gulp.task("sassbase", function() {
        return gulp.src(path.scssbase)
            .pipe(plumber({
                errorHandler: notify.onError('SCSSでError出てまっせ: <%= error.message %>')
            }))
            .pipe(sass({ outputStyle: 'expanded' }))
            .pipe(browser.reload({
                stream: true
            }))
    });



    gulp.task("js", function() {
        return gulp.src(path.js)
            .pipe(gulp.dest(dir.src + '/js'))
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
                suffix: '_min'
            }))
            .pipe(gulp.dest(dir.dist))
    });

    gulp.task("min:css", function() {
        return gulp.src(path.css)
            .pipe(cssmin())
            .pipe(rename({
                suffix: '_min'
            }))
            .pipe(gulp.dest(dir.dist + '/css'))
    });

    gulp.task("min:js", function() {
        return gulp.src(path.js)
            .pipe(uglify())
            .pipe(rename({
                suffix: '_min'
            }))
            .pipe(gulp.dest(dir.dist + '/js'))
    });

    gulp.task("min:img", function() {
        gulp.src(path.img + "/**/*.png")
            .pipe(imagemin({
                use: [pngquant()]
            }))
            .pipe(gulp.dest(path.img));

        gulp.src(path.img + "/**/*.jpg")
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(path.img));
    });


    /***********************************************************
    ejs
    ************************************************************/
    gulp.task("ejs", function() {
        return gulp.src(path.ejs)
            .pipe(plumber({
                errorHandler: notify.onError('ejsでError出てまっせ: <%= error.message %>')
            }))
            .pipe(ejs({
                site: JSON.parse(fs.readFileSync(develop.data + 'site.json'))
            }, { "ext": ".html" }))
            .pipe(gulp.dest(dir.src + '/deploy'))
            .pipe(browser.reload({
                stream: true
            }))
    });

    gulp.task("ejsbase", function() {
        return gulp.src(path.ejsbase)
            .pipe(plumber({
                errorHandler: notify.onError('ejsでError出てまっせ: <%= error.message %>')
            }))
            .pipe(ejs({
                site: JSON.parse(fs.readFileSync(develop.data + 'site.json'))
            }, { "ext": ".html" }))
            .pipe(gulp.dest(dir.src + '/deploy'))
            .pipe(browser.reload({
                stream: true
            }))
    });

    gulp.task("copy", function() {
        return gulp.src([
                '!_src/sass/**/*.scss',
                '!_src/ejs/**/*.ejs',
                '_src/**/*'
            ])
            .pipe(gulp.dest(dir.dist));
    });

    gulp.task("watch", function() {
        gulp.watch(path.ejs, ["ejs", "ejsbase", 'lint:html']);
        gulp.watch(path.ejsbase, ["ejs", "ejsbase", 'lint:html']);
        gulp.watch(path.scss, ["sass", "sassbase"]);
        gulp.watch(path.scssbase, ["sass", "sassbase"]);
    });

    gulp.task("prepare", function(callback) {
        return sequence(
            ['ejs', 'ejsbase'], ["sass", "sassbase"], ['lint:html'], ['watch'],
            callback
        );
    });

    gulp.task("deploy", function(callback) {
        return sequence(
            ['lint:html'], ['min:html', 'min:css'], ['copy'],
            callback
        );
    });

    gulp.task("default", function(callback) {
        return sequence(
            ['prepare'], ['server'],
            callback
        );
    });