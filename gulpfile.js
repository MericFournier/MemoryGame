const gulp         = require('gulp')
const plumber      = require('gulp-plumber')
const notify       = require('gulp-notify')
const sass         = require('gulp-sass')
const minify       = require('gulp-minify')
const sourcemaps   = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const rename       = require('gulp-rename')
const imagemin     = require('gulp-imagemin')
const connect      = require('gulp-connect')
const babel        = require('gulp-babel')
const open         = require('gulp-open')
const ip           = require('ip').address()

let config = {
    'src' : 'src/',
    'dist': 'dist/',
    'ip': ip,
    'port': 8080
}


gulp.task('liveserver', () => {
    connect.server({
        root: 'dist',
        livereload: true,
        host: config.ip,
        port: config.port
    })
})

gulp.task('uri', () => {
    return gulp.src(__filename)
        .pipe(open({
            uri: `http://${config.ip}:${config.port}`
        }))
})

gulp.task('sass', () => {
    return gulp.src(config.src + 'scss/*.scss')
        .pipe(plumber({errorHandler: notify.onError('SASS Error: <%= error.message %>')}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename(function (path) {
            path.basename += ".min"
        }))
        .pipe(gulp.dest(config.dist + 'assets/css'))
        .pipe(connect.reload())
        .pipe(notify('SASS compiled: <%= file.relative %>'))
})

gulp.task('javascript', () => {
    return gulp.src(config.src + 'js/*.js')
        .pipe(plumber({errorHandler: notify.onError("JS Error: <%= error.message %>")}))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
          },
          ignoreFiles: ['.min.js'],
          noSource: false
        }))
        .pipe(gulp.dest(config.dist + 'assets/js'))
        .pipe(connect.reload())
        .pipe(notify('JS compiled: <%= file.relative %>'))
})

gulp.task('images', () => {
    return gulp.src(config.src + 'img/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.dist + 'assets/img'))
        .pipe(connect.reload())
        .pipe(notify('Image minified: <%= file.relative %>'))
})

gulp.task('fonts', () => {
    return gulp.src(config.src + 'font/**/*')
        .pipe(gulp.dest(config.dist + 'assets/font'))
        .pipe(connect.reload())
        .pipe(notify('Font updated: <%= file.relative %>'))
})

gulp.task('html', () => {
    return gulp.src(config.src + '*.html')
        .pipe(gulp.dest(config.dist))
        .pipe(connect.reload())
        .pipe(notify('HTML updated: <%= file.relative %>'))
})

gulp.task('watch', () => {
    gulp.watch(config.src + '**/*.html', ['html'])
    gulp.watch(config.src + 'scss/**/*.scss', ['sass'])
    gulp.watch(config.src + 'js/*.js', ['javascript'])
    gulp.watch(config.src + 'img/*', ['images'])
    gulp.watch(config.src + 'font/*', ['fonts'])
})


gulp.task('connect', ['liveserver', 'uri'], () => {})

gulp.task('build', ['html', 'sass', 'javascript', 'images', 'fonts'], () => {})

gulp.task('default', ['build', 'connect', 'watch'], () => {})
