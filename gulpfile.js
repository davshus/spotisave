'use strict';
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
// var pump = require('pump');
// var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var uglifyify = require('uglifyify'); //What?
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');

const port = 8080;

function server (livereload) {
  return function() {
    gulp.src('dist')
      .pipe(webserver({
        livereload: livereload,
        port: port
      }));
  }
}

gulp.task('build', function() {
  var main =
    browserify({entries: 'src/main.js', extensions: ['.js'], debug: true})
      .transform(babelify)
      .transform(uglifyify)
      .bundle()
    .on('error', onError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/'));
  var html =
    gulp.src('src/**/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist/'));
  var css =
    gulp.src('src/**/*.css')
      .pipe(cleanCSS({compatibility: '*'}))
      .pipe(gulp.dest('dist/'));
  var js =
    gulp.src('src/**/(*.js|!main.js)')
      .pipe(gulp.dest('dist/'));
  var others =
    gulp.src('src/**/!(*.js|*.html|*.css)')
      .pipe(gulp.dest('dist/'));
  return merge(main, html, css, js, others);
});
gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*', ['build']);
});

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('serve', server(false));
gulp.task('live', server(true));

gulp.task('default', ['live', 'watch'])
