'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var reactify = require('reactify');

// set up the browserify instance on a task basis
var b = watchify(browserify({
  entries: './ui.js',
  debug: true,
  transform: [reactify]
}));

function bundle() {
  return b.bundle()
    .pipe(source('ui.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
}

b.on('update', bundle)
b.on('log', gutil.log);
gulp.task('default', bundle)
