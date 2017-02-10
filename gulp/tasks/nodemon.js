'use strict'
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('start', function() {
    nodemon({
        script: 'server/index.js',
        tasks: ['prepare'],
        ext: 'js ect',
        ignore: [
            'public/*.js',
            'public/**/*.js',
            'public/*.css',
            'public/**/*.css',
            'public/image/**/*.png',
            'coverage/**/*.js',
            'views/pc/index.ect',
            'views/sp/index.ect',
            '*/404.ect',
            '*/500.ect',
            'src/css/**/foundation/_sprite.scss'
        ],
        env: {
            'NODE_ENV': 'development',
            'PORT': 3000
        },
        legacyWatch: true
    }).on('restart', function() {})
})