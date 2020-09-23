'use strict';

const gulp = require('gulp');
const del = require('del');
const plugin = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const server = require("browser-sync").create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const Paths = {
  pug: {
    src: 'source/pug/*.pug',
    dest: 'build/'
  },
  sass: {
    base: 'source/sass/**/*.scss',
    src: 'source/sass/styles.scss',
    dest: 'build/css'
  },
  img: {
    src: 'source/img/**/*.{png,jpg,svg}',
    dest: 'build/img/',
    raster: 'source/img/**/*.{png,jpg}',
  },
  sprite: {
    src: 'source/svg-sprite/*.svg',
    dest: 'build/svg/'
  },
  js: {
    src: 'source/js/main.js',
    dest: 'build/js/'
  },
  assets: {
    src: ['source/assets/**/*.*', '!source/assets/**/*.md'],
    dest: 'build/'
  }
};



// Clean \\
gulp.task('clean', () => del('build'));

// Styles \\
gulp.task('styles', () =>
  gulp.src(Paths.sass.src)
    .pipe(plugin.plumber())
    .pipe(plugin.if(isDevelopment, plugin.sourcemaps.init()))
    .pipe(plugin.sass())
    .pipe(plugin.postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(plugin.if(isDevelopment, plugin.sourcemaps.write()))
    .pipe(gulp.dest(Paths.sass.dest))
    .pipe(server.stream())
);



// Images \\
gulp.task('img', () =>
  gulp.src(Paths.img.src)
    .pipe(plugin.if(!isDevelopment, plugin.imagemin([
      plugin.imagemin.optipng({optimizationLevel: 3}),
      plugin.imagemin.mozjpeg({progressive: true}),
      plugin.imagemin.svgo()
    ])))
    .pipe(gulp.dest(Paths.img.dest)));
gulp.task('img:webp', () =>
  gulp.src(Paths.img.raster)
    .pipe(plugin.webp({quality: 90}))
    .pipe(gulp.dest(Paths.img.dest)));
// gulp.task('img:sprite', () =>
//   gulp.src(Paths.sprite.src)
//     .pipe(plugin.svgstore({inlineSvg: true}))
//     .pipe(plugin.cheerio({
//       run: function ($) {
//         $('svg').attr('style',  'display:none');
//       },
//       parserOptions: { xmlMode: true }
//     }))
//     .pipe(gulp.dest(Paths.sprite.dest)));



// JS \\
gulp.task('scripts', () =>
  gulp.src(Paths.js.src)
    .pipe(webpackStream(webpackConfig))
    .pipe(plugin.uglify())
    .pipe(gulp.dest(Paths.js.dest))
);

// Watch \\
gulp.task('watch', () => {
  gulp.watch(Paths.sass.base, gulp.series('styles'));
  gulp.watch(Paths.img.src, gulp.series('img'));
  gulp.watch(Paths.js.src, gulp.series('scripts'));
});



// Build \\
gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'img', 'scripts'), 'img:webp'));

// Dev \\
gulp.task('dev', gulp.series('build', 'watch'));
