
// const include = require('gulp-file-include')
// const htmlmin = require('gulp-htmlmin')
// const sync = require('browser-sync').create()
const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const del =require('del');

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'build/css/'
  },
  script: {
    src: 'src/js/**/*.js',
    dest: 'build/js/'
  }
}


function styles() {
  return src(paths.styles.src)
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: [ 'last 2 version' ]
      }))
      .pipe(csso())
      .pipe(concat('main.min.css'))
      .pipe(dest(paths.styles.dest))
    }

    function clear() {
      return del(['build'])
    }

    function watching() {
      watch(paths.styles.src, styles)
    }


    const start = series(clear, styles, watching)
    exports.styles = styles
    exports.clear = clear
    exports.start = start
    exports.default = start


// function html() {
//   return src('src/**.html')
//     .pipe(include({
//       prefix: '@@'
//     }))
//     .pipe(htmlmin({
//       collapseWhitespace: true
//     }))
//     .pipe(dest('build'))
// }



// function serve() {
//   sync.init({
//     server: './build'
//   })
//   // @ts-ignore
//   watch('src/**.html', series(html)).on('change', sync.reload)
//   // @ts-ignore
//   watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
// }

// exports.build = series(clear, styles, html)
// exports.serve = series(clear, styles, html, serve)