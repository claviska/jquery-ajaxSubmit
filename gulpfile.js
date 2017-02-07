/* eslint-env node, es6 */
'use strict';

const gulp = require('gulp-help')(require('gulp'));
const del = require('del');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

// Clean
gulp.task('clean', 'Clean up!', () => {
  return del('jquery.ajaxSubmit.min.js');
});

// Minify
gulp.task('minify', 'Minify it!', ['clean'], () => {
  return gulp.src('jquery.ajaxSubmit.js')
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .on('error', (err) => {
      console.error(err);
      this.emit('end');
    })
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(__dirname));
});

// Watch for changes
gulp.task('watch', 'Watch for changes!', () => {
  gulp.watch('jquery.ajaxSubmit.js', ['minify']);
});

// Default
gulp.task('default', 'The default task.', ['watch']);
