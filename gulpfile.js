// const gulp = require('gulp'),
//     jshint = require('gulp-jshint'),
//     sass = require("gulp-sass"),
//     sourcemaps = require('gulp-sourcemaps'),
//     webserver = require('gulp-webserver');

// gulp.task('js', function() {
//     return gulp.src('builds/sassEssentials/js/myscript.js')
//         .pipe(jshint('./.jshintrc'))
//         .pipe(jshint.reporter('jshint-stylish'));
// });

// gulp.task('sass', function() {
//     return sass('process/sass/style.scss', {
//             sourcemap: true,
//             style: 'expanded'
//         })
//         .on('error', function(err) {
//             console.error('Error!', err.message);
//         })
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('builds/sassEssentials/css'));
// });

// gulp.task('watch', function() {
//     gulp.watch('builds/sassEssentials/js/**/*', ['js']);
//     gulp.watch(['process/sass/**/*'], ['sass']);
// });

// gulp.task('webserver', function() {
//     gulp.src('builds/sassEssentials/')
//         .pipe(webserver({
//             livereload: true,
//             open: true
//         }));
// });

// gulp.task('default', ['watch', 'sass', 'webserver']);

const gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create(),
    source = "./process/",
    dest = "./builds/sassEssentials/";

sass.compiler = require("node-sass");

function html() {
    return gulp.src(dest + "**/*.html");
}

function js() {
    return gulp.src(dest + "**/*.js");
}

function styles() {
    return gulp
        .src(source + "sass/style.scss")
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                sourcemap: true,
                style: "compressed"
            }).on("error", sass.logError)
        )
        .pipe(gulp.dest(dest + "css"));
}

function watch() {
    gulp.watch(dest + "js/**/*.js", js).on("change", browserSync.reload);
    gulp.watch(source + "sass/**/*", styles).on("change", browserSync.reload);
    gulp.watch(dest + "index.html", html).on("change", browserSync.reload);
}

function server() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: dest
        }
    });

    gulp
        .watch(source + "sass/**/*.scss", styles)
        .on("change", browserSync.reload);
    gulp.watch(dest + "js/**/*.js", js).on("change", browserSync.reload);
    gulp.watch(dest + "index.html", html).on("change", browserSync.reload);
}

var build = gulp.series(gulp.parallel(js, styles, html), server, watch);

gulp.task("default", build);