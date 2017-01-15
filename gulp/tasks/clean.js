'use strict'
var gulp = require('gulp');
var fs = require("fs");
var del = require('del');

// --------------------------------------------------------
var version = require('../config').version;
var f = require('../path');
f = f.func();
// --------------------------------------------------------


function clean(type) {
    if (type === 'img') {
        del(f.dir.src + '/deploy/' + f.work + '/**/*.+(png|gif|jpg|jpeg|svg|woff)')
    } else if (type === 'dist') {
        del(f.dir.dist + '/deploy/' + f.work);
    }
}
gulp.task('clean:dist', function() {
    return clean('dist');
});

gulp.task('clean:img', function() {
    return clean('img');
});