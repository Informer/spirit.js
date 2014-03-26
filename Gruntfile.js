'use strict';


module.exports = function(grunt) {

	/**
	 * Time grunt tasks
	 * And autoload all tasks
	 */
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	/**
	 * We'll use lodash
	 */
	var _ = require('lodash');

	/**
	 * Paths
	 * @type {Object}
	 */
	var path = {
		src: 'public/js/src',
		vendor: 'public/js/vendors',
		examples: 'public/examples'
	};


	/**
	 * Source files in order of concatenation
	 * NOTE: concat wraps these files between header.js & footer.js
	 * @type {Array}
	 */
	var sourceFiles = [
		// utils
		path.src + '/util/Lodash.js',
		path.src + '/util/Helpers.js',
		path.src + '/util/Globals.js',

		// source files
		path.src + '/event/*.js',
		path.src + '/model/AbstractModel.js',
		path.src + '/model/*.js',
		path.src + '/collection/AbstractCollection.js',
		path.src + '/collection/*.js',
	    path.src + '/jquery/*.js',
	];


	/**
	 * Library files needed as dependency
	 * @type {Array}
	 */
	var libraryFiles = [
		path.vendor + '/jquery/jquery.min.js',
		path.vendor + '/greensock-js/src/minified/TweenLite.min.js',
		path.vendor + '/greensock-js/src/minified/TimelineLite.min.js',
		path.vendor + '/greensock-js/src/minified/plugins/CSSPlugin.min.js',
		path.vendor + '/greensock-js/src/minified/easing/EasePack.min.js'
	];


	/**
	 * Ignore files for code hinting
	 * @type {Array}
	 */
	var ignoreHinting = [
		path.src + '/header.js',
		path.src + '/footer.js',
		path.src + '/util/Globals.js',
		path.src + '/util/Lodash.js',
		path.src + '/model/AbstractModel.js',
		path.src + '/collection/AbstractCollection.js'
	];


	/**
	 * Grunt configuration
	 * @type {Object}
	 */
	var config = {

		pkg: grunt.file.readJSON('package.json'),
		bower: grunt.file.readJSON('.bowerrc'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; \n*/\n',


		concat: {
			options: {separator: ';'},
			dist: {
				src: []
					.concat([path.src + '/header.js'])
					.concat(sourceFiles)
					.concat([path.src + '/footer.js']),
				dest: '<%= pkg.name %>.js'
			}
		},


		uglify: {
			dist: {
				files: {'<%= pkg.name %>.min.js': '<%= pkg.name %>.js'},
				options: {banner: '<%= banner %>'}
			}
		},


		replace: {
			buildversion: {
				src: ['spirit.min.js'],
				overwrite: true,
				replacements: [{
					from: '{buildversion}',
					to: '<%= pkg.version %>'
				}]
			}
		},


		watch: {
			src: {
				files: [path.src + '/**/*.js', path.src + '/*.js'],
				tasks: ['build', 'jshint:src', 'notify:success']
			},
			test: {
				files: ['test/*Spec.js'],
				tasks: ['jshint:spec', 'test:ci']
			}
		},


		jshint: {
			options: {jshintrc: '.jshintrc'},
			src: {
				options: {
					ignores: ignoreHinting
				},
				files: {
					src: ['Gruntfile.js', path.src + '/**/*.js']
				}
			},
			spec: ['test/*Spec.js']
		},


		notify: {
			success: {
				options: {message: 'Successfully compiled'}
			}
		},

		karma: {
			options: {
				configFile: 'karma.conf.js',
				runnerPort: 9999,
				singleRun: true,
				files: function() {

					return []
						/**
						 * We're not including header.js & footer.js in tests
						 * So instead provide a globals.js needed by sourceFiles
						 * Substitutes header.js & footer.js just for testing purposes
						 */
						.concat(grunt.file.expand('test/util/globals.js'))

						/**
						 * Library and source files to include
						 */
						.concat(grunt.file.expand(libraryFiles))
						.concat(grunt.file.expand(sourceFiles))

						/**
						 * Include fixtures (serve only)
						 */
						.concat([{ pattern: 'test/fixtures/*.json', watched: false, served: true, included: false}])

						/**
						 * And finally the specs
						 */
						.concat(grunt.file.expand([
							'test/helpers/*.js',
							'test/*Spec.js',
							'!test/AMDSpec.js'
						]));

				}.call(this)
			},
			all: {
				browsers: ['PhantomJS', 'Chrome', 'ChromeCanary', 'Firefox']
			},
			watch: {
				singleRun: false
			},
			headless: {
				browsers: ['PhantomJS']
			},
			amd: {
				options: {
					frameworks: ['jasmine', 'requirejs'],
					files: _.map(libraryFiles, function(lib){
						return { pattern: lib, included: false };
					}).concat([
						{ pattern: 'spirit.js', included: false },
						{ pattern: 'test/AMDSpec.js', included: false },

						'test/amd/config.js'
					])
				},
				browsers: ['PhantomJS']
			},
			coverage: {
				browsers: ['PhantomJS'],
				reporters: ['progress', 'coverage'],
				coverageReporter: {
					type: 'html',
					dir: 'coverage/'
				},
				preprocessors: function(){

					var cwd = {};
					cwd[path.src + '/*.js'] = cwd[path.src + '/**/*.js'] = ['coverage'];
					return cwd;

				}.call(this)
			}
		},


		open: {
			coverage: {
				path: function() {
					var reports = grunt.file.expand('coverage/PhantomJS*/index.html');
					return reports[reports.length - 1].toString();
				},
				app: 'Google Chrome'
			}
		},


		clean: {
			coverage: ["coverage", "path/to/dir/two"]
		}

	};


	/**
	 * Init the grunt config file
	 */
	grunt.initConfig(config);



	/**
	 * Grunt tasks
	 */
	grunt.registerTask('default', ['jshint', 'test', 'build']);
	grunt.registerTask('build', 'Create the build version (spirit.js & spirit.min.js)', ['concat', 'uglify', 'replace:buildversion']);
	grunt.registerTask('test', ['karma:all']);
	grunt.registerTask('test:ci', ['karma:headless', 'karma:amd']);
	grunt.registerTask('test:coverage', ['clean:coverage', 'karma:coverage', 'open:coverage']);
	grunt.registerTask('test:watch', ['karma:watch']);

};
