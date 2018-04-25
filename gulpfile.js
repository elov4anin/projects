var gulp = require('gulp');
var rename = require('gulp-rename');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');

var stylus = require("gulp-stylus"); /* Препроцессор stylus */
var cssnano = require("gulp-cssnano"); /* Минификация стилей */
var plumber = require("gulp-plumber"); /* Купирвоание ошибок */
var postcss = require("gulp-postcss"); /*Для работы плагинов postcss*/
var autoprefixer = require("autoprefixer"); /* Расстановка вендорных префиксов*/
var mqpacker = require("css-mqpacker"); /* сортировка медиа-выражений */
var svgstore = require("gulp-svgstore"); /* плагин сборки svg в один файло*/
var svgmin = require("gulp-svgmin"); /* минифкация svg */
var imagemin = require("gulp-imagemin"); /* минификация изображений */
var uglify =  require("gulp-uglify"); /* минификация скриптов */
var fileinclude = require("gulp-file-include"); /* плагин для вставки код из другого файла*/
var watch = require("gulp-watch"); /* плагин слежения за изменениями файлов*/
var server = require("browser-sync"); /* локальный сервер*/
var run = require("run-sequence"); /* запуск задач по очереди*/
var del = require("del"); /*плагин для удаления папки или файла*/
var debug = require('gulp-debug'); /* плагин для дебага*/
var argv = require('yargs').argv; /* Для передачи аргументов*/
var gulpif = require('gulp-if'); /* Для запуска плагинов в зависимости от ключа production*/
var gulpHtmlVersion = require('gulp-html-version'); /* добавление в вызов стилей версии сборки из package.json*/
var spritesmith = require('gulp.spritesmith'); /* плагинн для сборки PNG спрайта*/

var tap = require('gulp-tap');
var path = require('path');
var newfile = require('gulp-file');

var buildFolder = 'build';/*Папка сборки*/
var srcNew = "src";

gulp.task('scripts', function () {
    return gulp.src('./src/js/app.js')
        .pipe(webpackStream({
            output: {
                filename: 'app.js',
            },
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['env']
                        }
                    }
                ]
            },
            externals: {
                jquery: 'jQuery'
            }
        }))
        .pipe(gulp.dest(buildFolder))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(buildFolder))
        .pipe(server.reload({stream: true}));
});



/* Задача сброки  стилей из препроцессорных файлов, расстановки вендроных прификсов для последних 2 версии браузеров, минификации стилей с выводом результата в папку build/css */

gulp.task("style", function () {
    gulp.src("src/stylesheets/style.styl")
        .pipe(plumber())
        .pipe(stylus())
        .pipe(postcss([
            autoprefixer({browsers: [
                    'last 2 versions',
                    'last 2 Chrome versions',
                    'last 2 Firefox versions',
                    'last 2 Opera versions',
                    'last 2 Edge versions',
                    'last 2 UCAndroid versions'
                ]}),
            mqpacker({
                sort: false
            })
        ]))

        .pipe(gulpif(argv.production, cssnano())) /*минификация запускается для production*/
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest(buildFolder + "/css"))
        .pipe(server.reload({stream: true}));
});

/* Задача оптимизации изображений с выводом результата в папку build/img */

gulp.task("images", function () {
    return gulp.src(buildFolder + "/img/**/*.{png,jpg,gif}")

        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true})
        ]))
        .pipe(gulp.dest(buildFolder + "/img"));
});

/* Задача сборки из отдельных блоков верстки страниц в папку build */

gulp.task("html", function () {
    gulp.src(["src/template/**/*.html"])
        .pipe(plumber())
        .pipe(fileinclude({
                prefix: "@@",
                basepath: "./src/template"
            }
        ))
        .pipe(gulpif(argv.production, gulpHtmlVersion(
            {
                suffix: ['css'] /*версия сборки запускается для production*/
            }
        )))
        .pipe(gulp.dest(buildFolder))
        .pipe(server.reload({stream: true}));
});

/* Задача оптимизации svg графики с выводом в папку build/img */

gulp.task("symbols", function () {
    return gulp.src(buildFolder +  "/img/icons-svg/*.svg")
        .pipe(svgmin())
        .pipe(svgstore({
                inlineSvg:true
            }
        ))
        .pipe(rename("symbols.svg"))
        .pipe(gulp.dest(buildFolder + "/img"));
});
/*PHP files*/
gulp.task('connect-sync', function() {
    connect.server({}, function (){
        browserSync({
            proxy: '127.0.0.1'
        });
    });

    gulp.watch('**/*.php').on('change', function () {
        browserSync.reload();
    });
});

/* PNG спрайты*/
gulp.task('sprite', function() {
    var spriteData =
        gulp.src('src/img/png-sprite/*.png') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: '../img/png-sprite.png',
                cssName: 'sprite.styl',
                cssFormat: 'stylus',
                algorithm: 'binary-tree',
                padding: 2,
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest(buildFolder + "/img")); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('stylesheets')); // путь, куда сохраняем стили
});

/* Задача минификации скриптов js с выводом результата в папку build/js */

gulp.task("jsmin", function () {
    gulp.src("src/js/*.js")
        .pipe(plumber())
        .pipe(gulpif(argv.production, uglify())) /*минификация запускается для production*/
        /*  .pipe(rename({suffix: ".min"}))*/
        .pipe(gulp.dest(buildFolder + "/js"))
        .pipe(server.reload({stream: true}));
});

/* Задача копирования ресурсов для сборки проекта в папку build: шрифты, изображения, скрипты */

gulp.task("copy", function () {
    return gulp.src([
        "src/fonts/**/*.{woff,woff2,ttf,eot,otf}",
        "src/img/**",
        "src/php/**",
        "src/phpmailer/**"
    ], {
        base: "src"
    })
        .pipe(debug({title: 'unicorn:'}))
        .pipe(gulp.dest(buildFolder));
});

gulp.task("php", function () {
    connectPHP.server({ base: './', keepalive:true, hostname: 'localhost', port:8080, open: false})

    return gulp.src([
        "src/php/**",
        "src/phpmailer/**"
    ], {
        base: "src"
    })
        .pipe(gulp.dest(buildFolder))
        .pipe(server.reload({stream: true}));
});

/* Удаление старой версии проекта перед сборкой проекта */

gulp.task("clean", function () {
    return del(buildFolder);
});

/* Задача запуска локального сервера с корнем в папке build и его перезапуска в случае изменения файлов стилизации, верстки, скриптов */

gulp.task("serve", function () {
    server.init({
        server: buildFolder,
        port: 3000,
        //proxy: "127.0.0.1"

    });
    gulp.watch("src/stylesheets/**/*.styl", ["style"]);
    gulp.watch("src/template/**/*.html", ["html"]);
    gulp.watch("src/js/**/*.js", ["scripts"]);
    gulp.watch("src/php/*.php", ["php"]);
});

/* Задача сборки проекта в папку build. На выходе получаем оптимизированные и не оптимизированные файлы проекта: стили CSS, скрипты, изображения, верстка */

gulp.task("build", function (fn) {
    run(
        "clean",
        "copy",
        "html",
        "style",
        "scripts",
        "images",
        /*  "sprite",*/
        "serve",
        /*  "symbols",  */ /*сборка svg спрайтов не используется в проекте*/
        fn
    );
});
/* Задача по умолчанию при вызове команды gulp*/
gulp.task('default', function() {
    gulp.run('build');
});

gulp.task('newfolders', function () {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./' + srcNew + '/stylesheets/blocks'))
        .pipe(gulp.dest('./' + srcNew + '/img/icons-svg'))
        .pipe(gulp.dest('./' + srcNew + '/img/png-sprite'))
        .pipe(gulp.dest('./' + srcNew + '/fonts'))
        .pipe(gulp.dest('./' + srcNew + '/template/blocks'))
        .pipe(gulp.dest('./' + srcNew + '/js'))
        .pipe(gulp.dest('./' + srcNew + '/php'));
});

gulp.task('newhtml', function(){
    gulp.src('./'+srcNew+'/template')
        .pipe(tap(function(file){
            var fileName = "index.html";
            var contents = '<!DOCTYPE html>\n' +
                '<html lang="ru">\n' +
                '<head>\n' +
                '    <meta charset="UTF-8">\n' +
                '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                '    <meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
                '    <link rel="stylesheet" href="css/style.min.css">\n' +
                '    <title>Document</title>\n' +
                '</head>\n' +
                '<body>\n' +
                '<p>It is new porject</p>\n'+
                '<script src="app.js"></script>\n' +
                '</body>\n' +
                '</html>';
            return newfile(fileName, contents)
                .pipe(gulp.dest('./'+srcNew+'/template'));
        }));
});
gulp.task('newjs', function(){
    gulp.src('./'+srcNew+'/js')
        .pipe(tap(function(file){
            var fileName = "app.js";
            var contents = '//it is js script!';
            return newfile(fileName, contents)
                .pipe(gulp.dest('./'+srcNew+'/js'));
        }));
});

gulp.task('newcss', function(){
    gulp.src('./'+srcNew+'/stylesheets')
        .pipe(tap(function(file){
            var fileName = "style.styl";
            var contents = '//it is stylus!';
            return newfile(fileName, contents)
                .pipe(gulp.dest('./'+srcNew+'/stylesheets'));
        }));
});