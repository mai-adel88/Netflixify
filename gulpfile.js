var gulp        = require('gulp');
var browsersync = require('browser-sync');
var autoprefixer= require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var imagemin    = require('gulp-imagemin');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');

async function styles (){
    return gulp.src('src/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass( {outputStyle:'compressed'} )).on('error',sass.logError)
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browsersync.stream());
}

async function bootstrap_styles (){
    return gulp.src('src/bootstrap/bootstrap.scss')
    .pipe(sourcemaps.init())
    .pipe(sass( {outputStyle:'compressed'} )).on('error',sass.logError)
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(rename('bootstrap.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browsersync.stream());
}

async function vendor_styles (){  //plugins css
    return gulp.src('src/plugins/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browsersync.stream());
}

async function scripts (){
   gulp.src('src/js/**/*.js')
   .pipe(uglify())
   .pipe(rename('main.min.js'))
   .pipe(gulp.dest('dist/js'))
   .pipe(browsersync.stream()); 
}

async function vendor_scripts (){
    gulp.src('src/plugins/**/*.js')
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browsersync.stream()); 
 }

async function compresse_images(){
    return gulp.src('src/images/**/*.*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins:[
                {removeViewBox:true},
                {cleanupIDs:false}
            ]
        })
    ]))
    .pipe(gulp.dest('dist/images'))
    .pipe(browsersync.stream());
    
}

function watch() {
    browsersync.init({      //to watch changes without refresh browser
        server:{
            baseDir:'./'
        }
    });

    gulp.watch('src/scss/**/*.scss', styles);  // ** =>(folders)
    gulp.watch('src/bootstrap/**/*.scss', bootstrap_styles);
    gulp.watch('src/images/**/*.*', compresse_images);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('src/plugins/**/*.css', vendor_styles);
    gulp.watch('src/plugins/**/*.js', vendor_scripts);
    gulp.watch('./*.html').on('change', browsersync.reload);
}

// exports.styles = styles;
// exports.bootstrap_styles = bootstrap_styles;
exports.default = gulp.series(
    gulp.parallel([styles, bootstrap_styles]),
    gulp.parallel([vendor_styles, vendor_scripts]),
    scripts,
    compresse_images,
    watch,
)
