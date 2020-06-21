const { src, dest, watch, series, parallel } = require('gulp');

// Styles
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Images
const imageMin = require('gulp-imagemin');
const webp = require('gulp-webp');

// JavaScript
const uglify = require('gulp-uglify');

// Tools
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');

const iconFiles = [
  './src/favicon.ico',
  './src/favicon.svg',
  './src/mask-icon.svg',
  './src/apple-touch-icon.png',
  './src/google-touch-icon.png',
  './src/manifest.json'
];

function html(){
  return src('./src/*.html')
    .pipe(dest('./build'))
    .pipe(browserSync.stream());
}

function styles(){
  return src('./src/scss/styles.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(autoprefixer())
    .pipe(cleanCSS({
      debug: true,
      level: 2,
    }, 
      (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('./build/css'))
    .pipe(browserSync.stream());
}

function scripts(){
  return src('./src/js/*.js')
    .pipe(concat('scripts.js'))
    // .pipe(uglify())
    .pipe(dest('./build/js'))
    .pipe(browserSync.stream());
}

function images(){
  return src('./src/img/*')
    .pipe(imageMin([
      imageMin.gifsicle({interlaced: true}),
      imageMin.mozjpeg({quality: 75, progressive: true}),
      imageMin.optipng({optimizationLevel: 4}),
      imageMin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(dest('./build/img'))
    .pipe(browserSync.stream());
}

function webpImages() {
  return src('build/img/*.{png,jpg}')
    .pipe(webp({quality: 95,
                lossless: true}))
    .pipe(dest('build/img/webp'));
}

function fonts(){
  return src('./src/fonts/*')
    .pipe(dest('./build/fonts'))
    .pipe(browserSync.stream());
}

function watching(){
  browserSync.init({
    server: {
        baseDir: "build/"
    }
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/*.html', html);
  watch('./src/img/*', images);
  watch('.src/fonts/*', fonts);
}

function icons(){
  return src(iconFiles)
    .pipe(dest('./build'));
}

function clean() {
  return del(['build/*']);
}

exports.dev = series(
  clean,
  parallel(
    html,
    icons,
    styles,
    scripts,
    fonts,
    series (
      images,
      webpImages
    )
  ),
  watching
);