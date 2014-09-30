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

"use strict";

/**
 * Include Gulp and modules we'll use
 * @type {Gulp|exports}
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var pkg = require('./package.json');
var path = require('path');


/**
 * Source files in order of concatenation
 * NOTE: concat wraps these files between header.js & footer.js
 * @type {Array}
 */
var sourceFiles = [
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
];

/**
 * Library files needed as dependency
 * @type {Array}
 */
var vendorFiles = [
  'vendor/jquery/jquery.min.js',
  'vendor/greensock-js/src/minified/TweenLite.min.js',
  'vendor/greensock-js/src/minified/TimelineLite.min.js',
  'vendor/greensock-js/src/minified/plugins/CSSPlugin.min.js',
  'vendor/greensock-js/src/minified/easing/EasePack.min.js'
];

/**
 * Ignore files for code hinting
 * @type {Array}
 */
var ignoreHinting = [
  '**/src/header.js',
  '**/src/footer.js',
  '**/src/util/Globals.js',
  '**/src/util/Lodash.js',
  '**/src/model/AbstractModel.js',
  '**/src/collection/AbstractCollection.js'
];

/**
 * Include files for code coverage
 * testing purposes
 * @type {Array}
 */
var codeCoverage = [
  'src/collection/**/*.js',
  'src/model/**/*.js',
  'src/jquery/**/*.js',
  'src/event/**/*.js',

  // exclude
  '!src/collection/AbstractCollection.js',
  '!src/model/AbstractModel.js',
  '!src/event/Events.js'
];

/**
 * Task
 * Lint source files
 */
gulp.task('jshint:src', function(){
  return gulp.src(sourceFiles)
    .pipe(plugins.ignore.exclude(ignoreHinting))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.size({title: 'jshint'}));
});

/**
 * Task
 * Uglify and concat to spirit.js and spirit.min.js
 */
gulp.task('uglify', function(){
  var banner = [
    '/*!',
    ' * ' + [pkg.title, pkg.version, '(' + pkg.homepage + ')'].join(' '),
    ' * Copyright 2013 - ' + new Date().getFullYear() + ' Inlet.',
    ' * Licensed under Apache 2.0 (https://github.com/inlet/spirit.js/blob/master/LICENSE)',
    ' */'
  ];

  var files = []
    .concat('src/header.js')
    .concat(sourceFiles)
    .concat('src/footer.js');

  return gulp.src(files)
    .pipe(plugins.if('**/src/header.js', plugins.replace('{buildversion}', pkg.version)))
    .pipe(plugins.concat('spirit.js'))
    .pipe(plugins.uglifyjs('spirit.min.js', { outSourceMap: true }))
    .pipe(gulp.dest('.'))
    .pipe(plugins.size({title: 'uglify'}));
});

/**
 * Task
 * Clean up things
 */
gulp.task('clean', function(){

});

/**
 * Task
 * Watch source files files changed
 */
gulp.task('watch:src', function(){
  gulp.watch('src/**/**.js', ['uglify', 'jshint']);
});
















