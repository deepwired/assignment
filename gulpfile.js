var gulp = require('gulp');

var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('watch',['browserSync','sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/scss/*.scss', ['bs-reload']); 
  gulp.watch('app/*.html', ['bs-reload']); 
  gulp.watch('app/js/**/*.js', ['bs-reload']);
});
