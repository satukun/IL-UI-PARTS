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
    var changed = require('gulp-changed');

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
        "css": [dir.src + "/**/*.css", "!" + dir.src + "/**/*min.css"],
        "js": [dir.src + "/_develop/" + work + "/**/*.js", "!" + dir.src + "/_develop/" + work + "/**/*min.js"],
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
        return gulp.src(path.js)
            .pipe(gulp.dest(dir.src + '/deploy/' + work))
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
            .pipe(gulp.dest(dir.dist))
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

    gulp.task("deploy", function(callback) {
        return sequence(
            ['ejs'], ["sass"], ["js", "img"], ['lint:html'], ['min:html', 'min:css', 'min:img'], ['copy'],
            callback
        );
    });

    gulp.task("default", function(callback) {
        return sequence(
            ['prepare'], ['server'],
            callback
        );
    });