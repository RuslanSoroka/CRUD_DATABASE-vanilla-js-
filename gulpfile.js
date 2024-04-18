import gulp from "gulp";
import gulpSass from "gulp-sass";
import sass from "sass";
import babelMin from "gulp-babel-minify";
import concat from "gulp-concat";
import browserSync from "browser-sync";
import webp from "gulp-webp";
import htmlMin from "gulp-htmlmin";
import cssMin from "gulp-css-minify";

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
    gulp.src(PATH_FOLDER_JS)
        .pipe(babelMin())
        .pipe(concat("main.js"))
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
