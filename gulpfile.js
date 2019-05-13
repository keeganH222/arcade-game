const gulp = require('gulp');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const broswerSync = require('browser-sync');
const imageMin = require('gulp-imagemin');

gulp.task('style', () => {
  return gulp.src('./src/css/**/*.css')
    .pipe(autoPrefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
    .pipe(cleanCss({compatibility: '*'}))
    .pipe(gulp.dest('./dest/css'))
    .pipe(broswerSync.stream());
});

gulp.task('imageMin', () => {
  return gulp.src('./src/images/**/*.png')
    .pipe(imageMin())
    .pipe(gulp.dest('./dest/images'));
})

gulp.task('javaScript', () => {
  return gulp.src(['./src/js/**/resources.js', './src/js/**/app.js', './src/js/**/engine.js' ])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dest/js'))
    .pipe(broswerSync.stream());
});

gulp.task('copyHtml', () => {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dest/'))
    .pipe(broswerSync.stream());
})

gulp.task('watch', () => {
  gulp.watch('./src/css/**/*.css', gulp.series('style'));
  gulp.watch('./src/js/**/*.js', gulp.series('javaScript'));
  gulp.watch('./src/**/*.html', gulp.series('copyHtml'));
})

gulp.task('all', gulp.parallel('style', 'imageMin', 'javaScript', 'copyHtml', 'watch',  () => {
  broswerSync.init({
    server: {
      baseDir: './dest'
    }
  });
}))