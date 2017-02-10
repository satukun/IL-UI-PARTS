'use strict'
var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var pngquant = require('imagemin-pngquant');
var version = require('../config').version;

gulp.task('sprite:pc', function() {
    return sprite('pc')
});

gulp.task('sprite:sp', function() {
    return sprite('sp')
});

gulp.task('img:pc', function() {
    return image('pc');
});

gulp.task('img:sp', function() {
    return image('sp');
});

function image(device) {
    return gulp.src('./src/image/' + device + '/*.png')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./server/public/image/' + device));
}


function sprite(device) {
    var spriteData = gulp.src('./src/image/' + device + '/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite_' + version + '.png',
            cssName: '_sprite.scss',
            imgPath: '/image/' + device + '/sprite_' + version + '.png',
            cssFormat: 'scss',
            cssVarMap: function(sprite) {
                sprite.name = 'sprite-' + sprite.name;
            }
        }));

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./server/public/image/' + device));

    var cssStream = spriteData.css
        .pipe(gulp.dest('./src/css/' + device + '/foundation'));

    return merge(imgStream, cssStream);
}