const gulp = require("gulp");
const gulpSass = require("gulp-sass");
const sass = require("sass");
const concat = require("gulp-concat");
const browserSync = require("browser-sync");
const webp = require("gulp-webp");
const htmlMin = require("gulp-htmlmin");
const cssMin = require("gulp-css-minify");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;

const scssCompiler = gulpSass(sass);
const live = browserSync.create();
const SRC = "./src";
const PATH_FOLDER_SCSS = SRC + "/scss/**/*.scss";
const PATH_FOLDER_JS = SRC + "/js/**/*.js";
const PATH_FOLDER_IMG = SRC + "/img/**/*.*";
const BUILD_FOLDER = "./build";

async function sassCompilation() {
    gulp.src(PATH_FOLDER_SCSS)
        .pipe(scssCompiler())
        .pipe(cssMin())
        .pipe(gulp.dest(BUILD_FOLDER));
}

async function jsCompilation() {
    return gulp.src(PATH_FOLDER_JS)
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_FOLDER));
}

async function htmlComplication() {
    gulp.src("./*.html")
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest(BUILD_FOLDER));
}

gulp.task("browser-sync", function () {
    live.init({
        server: {
            baseDir: "./",
        },
        files: [PATH_FOLDER_SCSS, PATH_FOLDER_JS, PATH_FOLDER_IMG, "*.html"],
    });
});

async function webpCompilation() {
    gulp.src(PATH_FOLDER_IMG).pipe(webp()).pipe(gulp.dest(BUILD_FOLDER));
}

gulp.task("watch-scss", function () {
    gulp.watch(PATH_FOLDER_SCSS, sassCompilation);
});

gulp.task("watch-js", function () {
    gulp.watch(PATH_FOLDER_JS, jsCompilation);
});

gulp.task("html-min", htmlComplication);
gulp.task("webp", webpCompilation);
gulp.task("scss", sassCompilation);
gulp.task("js-min", jsCompilation);
gulp.task("watch", gulp.parallel("watch-scss", "watch-js", "browser-sync"));
gulp.task("default", gulp.parallel("html-min", "scss", "js-min", "webp"));
