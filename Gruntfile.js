'use strict';

module.exports = function(grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	/*
	 ------------
	 GRUNT CONFIG
	 -----------
	 */
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		bower: grunt.file.readJSON('.bowerrc'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; \n*/\n',


		path: {
			src: 'public/js/src',
			vendors: '<%= bower.directory %>'
		},


		concat: {
			options: {
				separator: ';'
			},

			dist: {
				src: [
					// utils
					'<%= path.src %>/util/Globals.js',
					'<%= path.src %>/util/Lodash.js',
					'<%= path.src %>/util/*.js',

				    // events
					'<%= path.src %>/event/*.js',

					// models
					'<%= path.src %>/model/AbstractModel.js',
					'<%= path.src %>/model/*.js',

					// collections
					'<%= path.src %>/collection/AbstractCollection.js',
					'<%= path.src %>/collection/*.js',

					// rest
					'<%= path.src %>/*.js'
				],
				dest: '<%= pkg.name %>.js'
			}
		},


		uglify: {
			dist: {
				files: {
					'<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
				},
				options: {
					banner: '<%= banner %>'
				}
			}
		},


		watch: {
			src: {
				files: ['<%= path.src %>/**/*.js', '<%= path.src %>/*.js'],
				tasks: ['concat:dist', 'jshint:src', 'notify:success']
			},
			test: {
				files: ['test/*Spec.js'],
				tasks: ['jshint:spec', 'test:ci']
			}
		},


		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			src: {
				options: {
					jshintrc: '.jshintrc',
					ignores: ['public/js/src/util/Lodash.js']
				},
				files: {
					src: ['Gruntfile.js', '<%= path.src %>/**/*.js', '<%= path.src %>/*.js']
				}
			},
			spec: ['test/*Spec.js']
		},


		notify: {
			success: {
				options: {
					message: 'Successfully compiled'
				}
			}
		},


		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg', 'banner'],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', 'bower.json', '<%= pkg.name %>.min.js', '<%= pkg.name %>.js'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin master',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		},


		karma: {
			options: {
				configFile: 'karma.conf.js',
				runnerPort: 9999,
				singleRun: true
			},
			all: {
				browsers: ['PhantomJS', 'Chrome', 'ChromeCanary', 'Firefox']
			},
			watch: {
				singleRun: false
			},
			continuous: {
				singleRun: true,
				browsers: ['PhantomJS']
			}
		}

	});


	/*
	 ------------
	 UPDATE KARMA TEST FILES WITH CONCAT FILES
	 -----------
	 */
	var karmaFiles = (function(){
		return [
			// libs
			'public/js/vendors/jquery/jquery.min.js',
			'public/js/vendors/greensock-js/src/minified/TweenLite.min.js',
			'public/js/vendors/greensock-js/src/minified/TimelineLite.min.js',
			'public/js/vendors/greensock-js/src/minified/plugins/CSSPlugin.min.js',
			'public/js/vendors/greensock-js/src/minified/easing/EasePack.min.js',

		].concat(grunt.config('concat.dist.src')).concat([
			// fixtures
			{ pattern: 'test/fixtures/*.json', watched: false, served: true, included: false},

			// specs
			'test/helpers/*.js',
			'test/*Spec.js'
		]);
	})();
	grunt.config('karma.options.files', karmaFiles);


	/*
	 ------------
	 GRUNT TASKS
	 -----------
	 */

	grunt.registerTask('build', 'Create the build version (spirit.js & spirit.min.js)', [
		'concat',
		'uglify'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	]);

	grunt.registerTask('test', ['karma:all']);
	grunt.registerTask('test:ci', ['karma:continuous']);

	grunt.registerTask('release', ['default', 'bump-commit']);
	grunt.registerTask('release:patch', ['bump-only:patch', 'release']);
	grunt.registerTask('release:minor', ['bump-only:minor', 'release']);
	grunt.registerTask('release:major', ['bump-only:major', 'release']);


};