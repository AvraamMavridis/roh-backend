"use strict";

var gulp = require('gulp');
var nodemon = require('nodemon');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');


// Restart the server for changes.
gulp.task('nodemon', function () {
    nodemon({ script: 'src/index.js', ext: 'js', 'execMap': { 'h': '--harmony'} });
});

// watch for changes and run the relevant task
gulp.task('watch', function () {
  watch('src/**/*.js', function(){
    return gulp.src('src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  });
});



gulp.task('default', [
    'lint',
    'nodemon',
    'watch'
]);



gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
