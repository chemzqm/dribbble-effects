var growl = require('growl')
var serve = require('gulp-live-serve')
var livereload = require('gulp-livereload')
var webpack = require('webpack')
var gutil = require('gulp-util')
var gulp = require('gulp')
var path = require('path')
var config = require('./webpack.config')
// no conflict
var myConfig = Object.assign({}, config, {
  devtool: 'sourcemap',
  debug: true
})

var paths = {
  // file list for webpack build
  scripts: ['lib/**/*.js', 'example/*.js'],
  // file list for reload
  asserts: ['example/resources/*', 'example/*.html']
}

gulp.task('default', ['build-dev'])

gulp.task('build-dev', ['webpack:build-dev', 'serve'], function () {
  livereload.listen({
    start: true
  })
  // build js files on change
  gulp.watch(paths.scripts, ['webpack:build-dev'])
  var watcher = gulp.watch(paths.asserts)
  watcher.on('change', function (e) {
    livereload.changed(e.path)
    growl(path.basename(e.path))
  })
})

// static server
gulp.task('serve', serve({
  root: __dirname,
  middlewares: []
}))


gulp.task('webpack:build-dev', function (callback) {
  var devCompiler = webpack(myConfig)
  devCompiler.run(function (err, stats) {
    if (err) throw new gutil.pluginError('webpack:build-dev', err) //eslint-disable-line
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }))
    callback()
  })
})
