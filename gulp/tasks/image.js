'use strict'
var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var pngquant = require('imagemin-pngquant');
var version = require('../config').version;

// --------------------------------------------------------
var f = require('../path');
f = f.func();
// --------------------------------------------------------

function image(device) {
    if (device === 'pc') {
        return gulp.src(f.path.img)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(f.dir.src + '/deploy/' + f.work));
    }
}

function sprite(device) {
    var spriteData = gulp.src(f.path.sprites)
        .pipe(spritesmith({
            imgName: 'sprite_' + version + '.png',
            cssName: '_sprite.scss',
            imgPath: f.develop.data + 'img/sprites/' + version + '.png',
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
        .pipe(gulp.dest(f.dir.src + '/deploy/' + f.work + '/img/sprites/'));

    var cssStream = spriteData.css
        .pipe(gulp.dest(f.dir.src + '/_develop/' + f.work + '/css/foundation/'));

    return merge(imgStream, cssStream);
}

gulp.task('sprite:pc', function() {
    return sprite('pc')
});

// gulp.task('sprite:sp', function() {
//     return sprite('sp')
// });

gulp.task('img:pc', function() {
    return image('pc');
});

// gulp.task('img:sp', function() {
//     return image('sp');
// });