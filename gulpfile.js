var gulp = require('gulp'), // Подключаем Gulp
  sass = require('gulp-sass'), //Подключаем Sass пакет,
  browserSync = require('browser-sync'), // Подключаем Browser Sync
  concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
  uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
  cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
  rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
  del = require('del'), // Подключаем библиотеку для удаления файлов и папок
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cashe = require('gulp-cache'),
  autoprefixer = require('gulp-autoprefixer')
pug = require('gulp-pug');
/* task for sass from sass folder */

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});



gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app"
    },
    notify: false
  });
});


gulp.task('scripts', function () {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js']
  )
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('code', function () {
  return gulp.src('app/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-libs', function () {
  return gulp.src('app/sass/libs.sass')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'));
});

gulp.task('clean', async function () {
  return del.sync('dist');
});


gulp.task('images', function () {
  return gulp.src('app/img/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build', async function () {
  var buildCss = gulp.src([
    'app/css/main.css',
    'app/css/libs.css',
  ])
    .pipe(gulp.dest('dist/css')
    )
  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist.fonts'))

  var buildJs = gulp.src('app/js**/*')
    .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist/html'))
});

gulp.task('pug', function buildHTML() {
  return gulp.src('pug/pages/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist/html/*.html'))
    .pipe(browserSync.reload())
});

gulp.task('watch', gulp.parallel('browser-sync', 'sass', 'scripts', 'css-libs', function () {
  gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
  gulp.watch('app/**/*.html').on('change', browserSync.reload);
  gulp.watch('app/js/*.js').on('change', browserSync.reload);
}));

gulp.task('default', gulp.parallel('css-libs', 'sass', 'scripts', 'pug', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('build', 'clean', 'images', 'sass', 'scripts'));