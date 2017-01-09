'use strict'
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
// var csso = require('gulp-csso');
var changed = require('gulp-changed');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var browser = require("browser-sync");
var notify = require("gulp-notify");
// var rename = require('gulp-rename');
// var filter = require('gulp-filter');

// --------------------------------------------------------
var f = require('../path');
f = f.func();
// --------------------------------------------------------


// var version = require('../config').version;

// function cssBuild(device, versions) {
//     return gulp.src('./src/css/' + device + '/**/*.scss')
//         .pipe(plumber())
//         .pipe(sass({
//             outputStyle: 'expanded'
//         }))
//         .pipe(filter('**/*.css'))
//         .pipe(autoprefixer({
//             browsers: versions
//         }))
//         .pipe(csscomb())
//         .pipe(rename({
//             suffix: '_' + device + '_' + version
//         }))
//         .pipe(csso())
//         .pipe(gulp.dest('./server/public'));
// }

// gulp.task('css-build:sp', function() {
//     return cssBuild('sp', ['ios >= 6', 'android >= 2.3']);
// });

// gulp.task('css-build:pc', function() {
//     return cssBuild('pc', ['last 2 versions', 'ie >= 8']);
// });

function cssBuild(device, versions) {
    if (device === 'pc') {
        return gulp.src(f.path.scss)
            .pipe(changed(f.dir.src + '/deploy/' + f.work))
            .pipe(plumber({
                errorHandler: notify.onError('SCSSでError出てまっせ: <%= error.message %>')
            }))
            .pipe(sass({ outputStyle: 'expanded' }))
            .pipe(autoprefixer({
                browsers: versions,
                cascade: false
            }))
            .pipe(csscomb())
            .pipe(gulp.dest(f.dir.src + '/deploy/' + f.work))
            .pipe(browser.reload({
                stream: true
            }))
    }
}
gulp.task('css-build:pc', function() {
    return cssBuild('pc', ['last 2 versions', 'ie >= 8']);
});