var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var argv = require('yargs').argv;
var jsonMinify = require('gulp-json-minify');
var gulpCopy = require('gulp-copy');
var runSequence = require('run-sequence');
var currentVersion;

function checkArgs() {
    var dest = argv.dest;
    var fileName = argv.src;
    var src = argv.src;
    if (dest === undefined) {
        gutil.log('Please pass dest');
        process.exit(1);
    }
    if (src === undefined) {
        gutil.log('Please pass src');
        process.exit(1);
    }
    return {
        dest: dest,
        src: src,
        fileName: fileName
    };
}

gulp.task('clean', function () {
    var args = checkArgs();
    return del([
        './' + args.dest + '/*'
    ]);
});

gulp.task('js', function () {
    var args = checkArgs();
    return gulp.src([args.src + '/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./' + args.dest + '/'));
});


gulp.task('minify-css', function () {
    var args = checkArgs();
    return gulp.src([args.src + '/**/*.css'])
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./' + args.dest + '/'));
});

gulp.task('minify-html', function () {
    var args = checkArgs();
    return gulp.src([args.src + '/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./' + args.dest + '/'));
});

gulp.task('minify-json', function () {
    var args = checkArgs();
    return gulp.src([args.src + '/**/*.json'])
        .pipe(jsonMinify())
        .pipe(gulp.dest('./' + args.dest + '/'));
});

gulp.task('copy', function () {
    var args = checkArgs();
    return gulp
        .src([args.src + '/**/*.*'])
        .pipe(gulp.dest('./' + args.dest + '/'));
});


gulp.task('default', function () {
    var args = checkArgs();
    runSequence("clean", "copy", "js", "minify-css", "minify-html", "minify-json",
        function () {
            gutil.log('Completed  task!');
        });
});