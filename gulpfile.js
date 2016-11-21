'use strict';

var gulp = require('gulp-help')(require('gulp')),
    del = require('del'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

// Clean
gulp.task('clean', 'Clean up!', function() {
    return del('jquery.ajaxSubmit.min.js');
});

// Minify
gulp.task('minify', 'Minify it!', ['clean'], function() {
    return gulp.src('jquery.ajaxSubmit.js')
        .pipe(uglify({
            preserveComments: 'license'
        }))
            .on('error', function(err) {
                notify(err).write(err);
                this.emit('end');
            })
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(__dirname));
});

// Watch for changes
gulp.task('watch', 'Watch for changes!', function() {
    gulp.watch('jquery.ajaxSubmit.js', ['minify']);
});

// Default
gulp.task('default', 'The default task.', ['watch']);
