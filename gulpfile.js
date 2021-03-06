const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const concat = require('gulp-concat');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();


//scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
   .pipe(concat('all.js'))
   .pipe(gulp.dest('source/js/2'));
}

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch(["source/*.html", "source/js/**/*.js"]).on("change", sync.reload);
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, scripts, server, watcher
);
