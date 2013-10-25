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
					'<%= path.src %>/util/Globals.js',
					'<%= path.src %>/util/*.js',
					'<%= path.src %>/*.js',
					'<%= path.src %>/extensions/*.js'
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
				tasks: ['concat:dist', 'jshint:src']
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

			src: ['Gruntfile.js', '<%= path.src %>/**/*.js'],
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