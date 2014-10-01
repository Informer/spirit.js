/**
 *
 * SpiritJS.
 * Copyright 2014 Inlet. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 *
 */

'use strict';

/**
 * Include Gulp and modules we'll use
 * @type {Gulp|exports}
 */
var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')();
var pkg = require('./package.json');
var runSequence = require('run-sequence');
var karma = require('karma').server;
var expand = require('glob-expand');
var _ = require('underscore');
var path = require('path');
var sfx = require('sfx');
var jshintNotifier = function(file) {
  if (file.jshint.success) { return false; }
  var errors = file.jshint.results.map(function(data) {
    if (data.error) {
      return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
    }
  }).join("\n");
  sfx.play("funk");
  return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
};

/**
 * Configuration
 * @type {Object}
 */
var config = {

  /**
   * Banner
   * @type {String}
   */
  banner: [
    '/*!',
    ' * <%= pkg.title %> <%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright 2013 - ' + new Date().getFullYear() + ' Inlet.',
    ' * Licensed under Apache 2.0 (https://github.com/inlet/spirit.js/blob/master/LICENSE)',
    ' */'
  ].join('\n'),

  /**
   * Source files in order of concatenation
   * NOTE: concat wraps these files between header.js & footer.js
   * @type {Array}
   */
  sourceFiles: [
    // utils
    'src/util/Lodash.js',
    'src/util/Helpers.js',
    'src/util/Globals.js',

    // source files
    'src/event/*.js',
    'src/model/AbstractModel.js',
    'src/model/*.js',
    'src/model/vo/*.js',
    'src/collection/AbstractCollection.js',
    'src/collection/*.js',
    'src/jquery/*.js'
  ],

  /**
   * Library files needed as dependency
   * @type {Array}
   */
  vendorFiles: [
    'vendor/jquery/jquery.js',
    'vendor/greensock-js/src/minified/TweenLite.min.js',
    'vendor/greensock-js/src/minified/TimelineLite.min.js',
    'vendor/greensock-js/src/minified/plugins/CSSPlugin.min.js',
    'vendor/greensock-js/src/minified/easing/EasePack.min.js'
  ],

  /**
   * Ignore files for code hinting
   * @type {Array}
   */
  ignoreHinting: [
    '**/src/header.js',
    '**/src/footer.js',
    '**/src/util/Globals.js',
    '**/src/util/Lodash.js',
    '**/src/model/AbstractModel.js',
    '**/src/collection/AbstractCollection.js'
  ],

  /**
   * Include files for code coverage
   * testing purposes
   * @type {Array}
   */
  codeCoverage: [
    'src/collection/**/*.js',
    'src/model/**/*.js',
    'src/jquery/**/*.js',
    'src/event/**/*.js',

    // exclude
    '!src/collection/AbstractCollection.js',
    '!src/model/AbstractModel.js',
    '!src/event/Events.js'
  ],

  /**
   * Files include for karma tests
   * @type {Function}
   */
  testFiles: function() {
    return []
      // Substitutes header.js & footer.js just for testing purposes
      .concat('test/util/globals.js')

      // Library and source files to include
      .concat(expand({cwd: '.'}, config.vendorFiles))
      .concat(expand({cwd: '.'}, config.sourceFiles))

      // Include fixtures (serve only)
      .concat([{ pattern: 'test/fixtures/*.json', watched: false, served: true, included: false }])

      // And finally the specs
      .concat(expand({cwd: '.'}, [
        'test/helpers/*.js',
        'test/*Spec.js',
        '!test/AMDSpec.js'
      ]));
  }

};

/**
 * -------------------------
 * TASKS
 * -------------------------
 */

// Default build spirit
gulp.task('default', ['jshint:src', 'uglify']);

// Lint source files
gulp.task('jshint:src', function() {
  return gulp.src(config.sourceFiles)
    .pipe(plugins.ignore.exclude(config.ignoreHinting))
    .pipe(plugins.jshint())
    .pipe(plugins.notify(jshintNotifier))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.size({title: 'jshint:src'}));
});

gulp.task('jshint:test', function(){
  return gulp.src('test/*Spec.js')
    .pipe(plugins.jshint())
    .pipe(plugins.notify(jshintNotifier))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.size({title: 'jshint:test'}));
});

// Uglify and concat to spirit.js and spirit.min.js
gulp.task('uglify', function() {
  var files = []
    .concat('src/header.js')
    .concat(config.sourceFiles)
    .concat('src/footer.js');

  return gulp.src(files)
    .pipe(plugins.if('**/src/header.js', plugins.replace('{buildversion}', pkg.version)))
    .pipe(plugins.concat('spirit.js'))
    .pipe(plugins.uglifyjs('spirit.min.js', { outSourceMap: true }))
    .pipe(plugins.header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest('.'))
    .pipe(plugins.size({title: 'uglify'}));
});

// Test all specs headless
gulp.task('test', function(cb){
  runSequence('test:src', 'test:amd', cb);
});

// Test source specs
gulp.task('test:src', function(cb) {
  var test = karma.start({
    configFile: __dirname + '/karma.conf.js',
    files: config.testFiles(),
    browsers: ['PhantomJS']
  }, function(exitCode){
    if (exitCode) {
      sfx.play("funk");
    }
    cb();
  });
});

// Test amd specs
gulp.task('test:amd', function(cb){
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    frameworks: ['jasmine', 'requirejs'],
    browsers: ['PhantomJS'],
    files: _.map(expand({cwd: '.'}, config.vendorFiles), function(file){
      return {pattern: file, included: false};
    }).concat([
      { pattern: 'spirit.min.js', included: false },
      { pattern: 'spirit.min.js.map', included: false },
      { pattern: 'test/AMDSpec.js', included: false },

      'test/amd/config.js'
    ])
  }, function(){
    cb();
  });
});

// Test over Chrome
gulp.task('test:browser', function(cb){
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    files: config.testFiles(),
    browsers: ['Chrome'],
    singleRun: false
  }, function(){
    cb();
  });
});

// Create a coverage report
gulp.task('test:coverage', function(cb){
  var includeAsCoverage = (function(){
    var cwd = {};
    _.each(expand({cwd: '.'}, config.codeCoverage), function(file){
      cwd[file] = ['coverage'];
    });
    return cwd;
  })();

  karma.start({
    configFile: __dirname + '/karma.conf.js',
    files: config.testFiles(),
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    preprocessors: includeAsCoverage
  }, function(){
    gulp.src('coverage/PhantomJS*/index.html')
      .pipe(plugins.open("<%file.path%>"))
      .pipe(plugins.size({title: 'test:coverage'}))
      .on('end', cb);
  });
});

// Clean up things
gulp.task('clean', del.bind(null, ['coverage', 'spirit.min.js', 'spirit.min.js.map']));

// Watch files
gulp.task('watch', ['watch:src', 'watch:test']);

// Watch source files
gulp.task('watch:src', function() {
  gulp.watch('src/**/**.js', ['jshint:src', 'uglify']);
});

// Watch specs
gulp.task('watch:test', function(){
  gulp.watch('test/*Spec.js', ['jshint:test', 'test:src']);
});
