const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const sync = require('browser-sync').create();

// HTML

const html = () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest('build'))
    .pipe(sync.stream());
};

exports.html = html;

// Styles

const styles = () => {
  return gulp.src('src/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      require('autoprefixer'),
      require('postcss-csso'),
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
};

exports.styles = styles;

//Scripts

const scripts = () => {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('build/js'))
    .pipe(sync.stream());
};


// Copy

const copy = () => {
  return gulp.src([
    'src/fonts/**/*',
    'src/images/**/*',
    'src/favicon.ico',
    'src/manifest.json'
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('build'))
  .pipe(sync.stream({
    once: true
  }));
};

exports.copy = copy;

const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'build'
      }
  });
};

exports.server = server;

// Watch

const watch = () => {
  gulp.watch('src/*.html', gulp.series(html));
  gulp.watch('src/styles/**/*.scss', gulp.series(styles));
  gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
  gulp.watch([
    'src/fonts/**/*',
    'src/images/**/*',
  ], gulp.series(copy));
};

exports.watch = watch;

const clean = () => {
  return del(['build/*']);
};

exports.clean = clean;

exports.default = gulp.series(
  clean,
  gulp.parallel(
      html,
      styles,
      scripts,
      copy,
  ),
  gulp.parallel(
      watch,
      server,
  ),
);