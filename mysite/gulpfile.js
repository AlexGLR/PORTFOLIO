var gulp = require('gulp'),
    del = require('del'),
    fileinclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync');

var path = {
    build: {
        root: 'build/',
        html: 'build/',
        css: 'build/css/',
        js: 'build/js/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        vendors: 'build/js/vendors/'
    },
    src: {
        html: 'src/*.html',
        sass: 'src/sass/*.scss',
        headersass: 'src/headersass/header.scss',
        js: 'src/js/*.js',
        img: 'src/img/**/*',
        fonts: 'src/fonts/**/*.*',
        vendors: 'src/js/vendors/**/*.*',
    }
};
// SERVER
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'build'
        },
        notify: false
    });
});

// HTML
gulp.task('html', function() {
    gulp.src(path.src.html)
        .on("error", notify.onError())
        .pipe(fileinclude({
		    prefix: '@@'
		}))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// CSS
gulp.task('style', function() {
    return gulp.src(path.src.sass)
        .pipe(sass()).on("error", notify.onError())
        .pipe(autoprefixer({
            browsers: ['last 30 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('headersass', function() {
	return gulp.src(path.src.headersass)
		.pipe(sass().on("error", notify.onError()))
		.pipe(autoprefixer(['last 30 versions']))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('src/headersass/'))
		.pipe(browserSync.reload({stream: true}))
});

// JS
gulp.task('js', function() {
    gulp.src(path.src.js)
        /*.pipe(babel({
             presets: ['es2015']
         }))*/
        .pipe(uglify())
        .on("error", notify.onError())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// IMAGES
gulp.task('image', function() {
    gulp.src(path.src.img)
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant(), jpegtran()],
            interlaced: true
        }))).on("error", notify.onError())
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// SPRITE
gulp.task('sprite', function() {
    var spriteData = gulp.src('src/img/sprite/*.png').pipe(spritesmith({
        retinaSrcFilter: ['src/img/sprite/*-2x.png'],
        retinaImgName: 'sprite-2x.png',
        retinaImgPath: '../img/sprite-2x.png',
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        padding: 5,
        algorithm: 'diagonal',
        imgPath: '../img/sprite.png'
    }));

    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('src/sass/'));
    spriteData.pipe(browserSync.reload({
        stream: true
    }));

});

// FONTS
gulp.task('font', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// VENDORS
gulp.task('vendors', function() {
    gulp.src(path.src.vendors)
        // .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.vendors))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// SERVICE FILES
gulp.task('buildServiceFiles', function() {
    var buildFiles = gulp.src([
        'src/mail.php', 'src/.htaccess', 'src/robots.txt'
    ]).pipe(gulp.dest('build/'));
});

// CLEANING OF OLDER PROJECT
gulp.task('removedist', function() {
    return del.sync('build');
});

// WATCH
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(path.src.sass, ['style']);
    gulp.watch(path.src.headersass, ['headersass']);
    gulp.watch(path.src.html, ['html']);
    gulp.watch(path.src.js, ['js']);
    gulp.watch(path.src.img, ['image']);
    gulp.watch(path.src.fonts, ['font']);
    gulp.watch(path.src.vendors, ['vendors']);
});

// BUILD
gulp.task('build', [
    'removedist',
    'buildServiceFiles',
    'html',
    'sprite',
    'headersass',
    'style',
    'js',
    'image',
    'font',
    'vendors',
    'browser-sync'
]);

gulp.task('clearcache', function() {
    return cache.clearAll();
});

gulp.task('default', ['build', 'watch']);
