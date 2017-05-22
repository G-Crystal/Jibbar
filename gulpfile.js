var gulp = require('gulp'),
  sass = require('gulp-sass'),
  jshint = require('gulp-jshint'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  useref = require('gulp-useref'),
  replace = require('gulp-replace'),
  templateCache = require('gulp-angular-templatecache'),
  gulpif = require('gulp-if'),
  gulpUtil = require('gulp-util'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-clean-css'),
  merge = require('merge-stream'),
  clean = require('gulp-clean'),
  inject = require('gulp-inject'),
  svgSprite = require('gulp-svg-sprite'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer');

/* DEV */
gulp.task('dev-serve', function () {
  browserSync.init({
    server: './'
  });

  gulp.watch('app/**/*.scss', ['sass']);
  gulp.watch('app/**/*.html', ['inject', 'reload']);
  gulp.watch('app/**/*.js', ['inject', 'reload']);
  gulp.watch('app/images/svg-sprite/*', ['svg-sprite', 'reload']);
  gulp.watch('app/images/**/*', ['reload']);
});

/* PROD */
gulp.task('prod-serve', function () {
  browserSync.init({
    server: './www'
  });

  gulp.watch('app/**/*.scss', ['sass', 'build-html']);
  gulp.watch('app/**/*.html', ['inject', 'minify-scripts', 'reload']);
  gulp.watch('app/**/*.js', ['inject', 'minify-scripts', 'reload']);
  gulp.watch('app/images/**/*', ['copy-images', 'reload']);
});

// SVG SPRITE
gulp.task('svg-sprite', function () {
  var svgPath = 'app/images/svg-sprite/*.svg';

  return gulp.src(svgPath)
    .pipe(svgSprite({
      shape: {
        spacing: {
          padding: 0
        }
      },
      mode: {
        css: {
          dest: './',
          layout: 'diagonal',
          sprite: 'app/images/sprite.svg',
          bust: false,
          render: {
            scss: {
              dest: 'app/styles/tools/_sprite.scss',
              template: 'app/styles/tools/_sprite-template.tpl'
            }
          }
        }
      },
      variables: {
        mapname: 'icons'
      }
    }))
    .pipe(gulp.dest('./'));
});

// SCSS
gulp.task('sass', function () {
  gulp.task('sass', function () {
    return gulp.src('app/**/*.scss')
      .pipe(sass())
      .pipe(concat('style.css'))
      .pipe(postcss([autoprefixer()]))
      .pipe(gulp.dest('app'))
      .pipe(browserSync.stream());
  });
});


// INJECT
gulp.task('inject', function () {
  return gulp.src('app/index.html')
    .pipe(inject(gulp.src(['app/**/*.module.js', 'app/**/*.js', '!app/vendor/**/*.js'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./app'));
});


// HTML
gulp.task('build-html', function () {
  return gulp.src('app/index.html')
    .pipe(replace('href="/app/"', 'href="/"')) // replace base href
    .pipe(useref())
    .pipe(gulpif('*.js', uglify().on('error', gulpUtil.log)))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('www'));
});


// IMAGES
gulp.task('copy-images', function () {
  return gulp.src(['app/images/*'])
    .pipe(gulp.dest('www/images'));
});


// TEMPLATES
gulp.task('bundle-templates', function () {
  return gulp.src(['app/**/*.html', '!app/index.html'])
    .pipe(gulpif('*.html', templateCache({module: 'jibbar'})))
    .pipe(concat('templates.min.js'))
    .pipe(gulp.dest('www/tmp'));
});


// COMPONENTS
gulp.task('bundle-components', function () {
  return gulp.src(['app/**/*.module.js', 'app/**/*.js', '!app/vendor/**/*.js'])
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('www'));
});


// MERGE TEMPLATES AND COMPONENTS
gulp.task('merge-templates-and-components', ['bundle-templates', 'bundle-components'], function () {
  return gulp.src(['www/script.min.js', 'www/tmp/templates.min.js'])
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('www'))
});


// MINIFY SCRIPTS
gulp.task('minify-scripts', ['merge-templates-and-components', 'bundle-templates', 'bundle-components'], function () {
  return gulp.src('www/script.min.js')
    .pipe(uglify().on('error', gulpUtil.log))
    .pipe(gulp.dest('www'))
});


// CLEAN TEMP
gulp.task('clean', ['bundle-templates', 'bundle-components', 'merge-templates-and-components'], function () {
  return gulp.src('www/tmp', {read: false})
    .pipe(clean());
});


// RELOAD BROWSER
gulp.task('reload', ['inject'], function () {
  browserSync.reload();
});


gulp.task('dev', [
  'inject',
  'svg-sprite',
  'sass',
  'dev-serve'
]);

gulp.task('prod', [
  'inject',
  'sass',
  'build-html',
  'copy-images',
  'minify-scripts',
  'clean',
  'prod-serve'
]);
