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
  var script =
      browserify({entries: 'src/index.js', extensions: ['.js'], debug: true})
        .transform(babelify)
        .transform(uglifyify)
        .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('dist/'));
  var others = gulp.src('src/**/!(*.js)')
    .pipe(gulp.dest('dist/'));
  return merge(script, others);
});
gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*', ['build']);
});

gulp.task('serve', server(false));
gulp.task('live', server(true));

gulp.task('default', ['live', 'watch'])
