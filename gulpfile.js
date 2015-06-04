"use strict";

var gulp = require('gulp');
var nodemon = require('nodemon');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var connect = require('gulp-connect');


// watch for changes and run the relevant task
gulp.task('watch', function () {
  watch('src/**/*.js', function(){
    return gulp.src('src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  });
});

gulp.task('serveprod', function() {
  connect.server({
    root: 'src/index.js',
    port: process.env.PORT || 5000, // localhost:5000
    livereload: false
  });
});


gulp.task('default', [
    'lint',
    'serveprod',
    'watch'
]);



gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
