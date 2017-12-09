var gulp = require('gulp');
var uglify = require('gulp-uglify');

var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

var sass = require('gulp-sass');

//var babel = require('gulp-babel');

//file paths
var SRC_PATH = './';

var SCRIPTS_PATH = SRC_PATH+'scripts/*.js';
var SCRIPTS_WATCH_PATH = SRC_PATH+'scripts/**/*.js';

var SCSS_PATH = SRC_PATH+'scss/styles.scss';
var SCSS_WATCH_PATH = SRC_PATH+'scss/**/*.scss';

var THEME_PATH = '../';
var LOCAL_PATH = 'shooter';

/**
 * SCSS/SASS task
 */

gulp.task('sass-styles', function() {
    console.log('Styling...');

    return gulp.src(SCSS_PATH)
        .pipe(plumber(function(err){
          //this function will run WHEN an error occurs in this task
          console.log('Styles Task Error');
          console.log(err);
          this.emit('end'); //this line will stop this task chain but continue running gulp
        }))
        //.pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: ['last 2 versions']
        }))
        .pipe(sass({
          outputStyle: 'compressed'
        })
          .on('error', sass.logError))
        .pipe(rename({
            basename: "game"
          }))
        .pipe(gulp.dest(THEME_PATH + '/css'));

});

// Scripts
gulp.task('scripts', function() {
    console.log('Scripting...');

    return gulp.src([SRC_PATH+'scripts/setup.js',SRC_PATH+'scripts/functions.js',SRC_PATH+'scripts/scene-main.js', SRC_PATH+'scripts/game.js'])
        .pipe(plumber(function(err){
          //this function will run WHEN an error occurs in this task
          console.log('Styles Task Error');
          console.log(err);
          this.emit('end'); //this line will stop this task chain but continue running gulp
        }))
        //.pipe(uglify())
        .pipe(concat('game.js'))
        .pipe(gulp.dest(THEME_PATH + '/js'));
});

gulp.task('browser-sync', function(){
    console.log('Syncing...');
    browserSync.init({
        proxy: "http://localhost/jamesgames/"+LOCAL_PATH
  });

    gulp.watch(THEME_PATH + "/css/*.css").on('change', browserSync.reload);
    gulp.watch(THEME_PATH + "/js/*.js").on('change', browserSync.reload);
    gulp.watch(THEME_PATH + "/**/*.html").on('change', browserSync.reload);
});

// Default task, will run all common tasks at once
gulp.task('default', ['sass-styles','scripts'], function() { //,'browser-sync'
    console.log('Gulping...');
});

// Setup gulp dev server
gulp.task('watch', ['default'], function() {
    console.log('Watching you...');
    gulp.watch(SCRIPTS_WATCH_PATH, ['scripts']);
    gulp.watch(SCSS_WATCH_PATH, ['sass-styles']);
});
