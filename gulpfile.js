const { src, dest, series, watch, parallel } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const include = require('gulp-file-include');
const babel = require('gulp-babel');
const csso = require('gulp-csso');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
var newer = require('gulp-newer');
const size = require('gulp-size');
const browsersync = require('browser-sync').create();
const gulppug = require('gulp-pug');
const del = require('del');

const paths = {
  pug: {
    src: 'src/*.pug',
    dest: 'build/',
  },
  html: {
    src: 'src/*.html',
    dest: 'build/',
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'build/css/',
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'build/js/',
  },
  images: {
    src: 'src/images/**/*',
    dest: 'build/media/',
  },
};

function pug() {
  return src(paths.pug.src)
    .pipe(gulppug())
    .pipe(dest(paths.pug.dest))
    .pipe(browsersync.stream());
}

function html() {
  return src(paths.html.src)
    .pipe(
      include({
        prefix: '@@',
      }),
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      }),
    )
    .pipe(dest(paths.html.dest))
    .pipe(browsersync.stream());
}

function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ['last 2 version'],
        cascade: false,
      }),
    )
    .pipe(csso())
    .pipe(concat('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(browsersync.stream());
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dest))
    .pipe(browsersync.stream());
}

async function images() {
  const imagemin = await import('gulp-imagemin');
  const imagePlugins = [
    imagemin.mozjpeg({
      progressive: true,
    }),
    imagemin.optipng({
      optimizationLevel: 5,
    }),
  ];

  return src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin.default(imagePlugins))
    .pipe(dest(paths.images.dest));
}

function clear() {
  return del(['build/*', '!build/media']);
}
function clearFull() {
  return del(['build']);
}

function buildSize() {
  return src('build/**/*').pipe(
    size({
      showTotal: true,
    }),
  );
}
function srcSize() {
  return src('src/**/*').pipe(
    size({
      showTotal: true,
    }),
  );
}

function watching() {
  browsersync.init({
    server: {
      baseDir: './build/',
    },
  });
  watch(paths.html.dest).on('change', browsersync.reload);
  watch(paths.html.src, html);
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.images.src, images);
}

const start = series(
  clear,
  html,
  parallel(styles, scripts, images),
  srcSize,
  buildSize,
  watching,
);
const build = series(
  clearFull,
  html,
  parallel(styles, scripts, images),
  srcSize,
  buildSize,
);

// Gulp command line
exports.pug = pug;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.clear = clear;
exports.clearfull = clearFull;
exports.default = start;
exports.build = build;
exports.start = start;
