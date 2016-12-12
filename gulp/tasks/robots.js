var robots = require('gulp-robots');
var gulp = require('gulp');

gulp.task('robots', function (callback) {
  gulp.src('./views/pc/index.ect')
    .pipe(robots({
      useragent: '*',
      allow: ['/'],
      disallow: [],
      sitemap: 'http://blogtag.ameba.jp/sitemap.xml'
    }))
    .pipe(gulp.dest('./server/public')).on('end', function() {
      // callbackを実行してgulpにタスク完了を通知
      callback();
    });
});