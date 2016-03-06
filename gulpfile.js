var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var webpack = require('gulp-webpack');
var del = require('del');
var runSequence = require('run-sequence');

// to investigate : why this does not render the javascript but in bash gulp clean && gulp build && gulp watch works
gulp.task('default', function(){
  runSequence(['clean', 'build'])
});

gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('html', function(){
  return gulp.src('src/*.html')
  .pipe(gulp.dest('dist'))
});

gulp.task('clean', function() {
  return del.sync('dist');
})

gulp.task('bundle', function() {
    return gulp.src('src/components/javascripts/*.js')
      .pipe(webpack({
        output: {
          filename: 'bundle.js'
        },
        module: {
          loaders: [
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel',
              query: {
                presets: ['react', 'es2015']
              }
            }
          ]
        }
    }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
});

gulp.task('build', function(){
  runSequence(['bundle', 'html', 'sass'])
});

gulp.task('watch', ['browserSync'], function(){
  gulp.watch('src/scss/**/*.scss', ['sass', browserSync.reload]);
  gulp.watch('src/*.html', ['html', browserSync.reload]);
  gulp.watch('src/components/javascripts/*.js', ['bundle', browserSync.reload]);
});
