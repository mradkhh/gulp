const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const del =require('del');
const sync = require('browser-sync').create()

function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('build'))
}

function scss() {
  return src('src/scss/**.scss')
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: [ 'last 2 version' ]
      }))
      .pipe(csso())
      .pipe(concat('index.css'))
      .pipe(dest('build'))
}

function clear() {
  return del('build')
}

function serve() {
  sync.init({
    server: './build'
  })
  // @ts-ignore
  watch('src/**.html', series(html)).on('change', sync.reload)
  // @ts-ignore
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
}

exports.build = series(clear, scss, html)
exports.serve = series(clear, scss, html, serve)
exports.clear = clear