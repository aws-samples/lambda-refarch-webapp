'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject', ['scripts'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/lib/aws-api-client/lib/axios/dist/axios.standalone.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/CryptoJS/components/hmac.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/CryptoJS/components/enc-base64.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/CryptoJS/rollups/hmac-sha256.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/CryptoJS/rollups/sha256.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/url-template/url-template.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/apiGatewayCore/sigV4Client.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/apiGatewayCore/apiGatewayClient.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/apiGatewayCore/simpleHttpClient.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/lib/apiGatewayCore/utils.js'),
    path.join(conf.paths.src, '/lib/aws-api-client/apigClient.js'),
    path.join(conf.paths.src, '/lib/aws-cognito/*.js'),
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
