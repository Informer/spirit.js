'use strict';


module.exports = function(grunt) {


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bower: grunt.file.readJSON('.bowerrc'),

		path: {
			src: 'public/js/src',
			vendors: '<%= bower.directory %>'
		},

		banner: '/*! <%= pkg.title || pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
			'| <%= pkg.repository.url %>\n' +
			'| Copyright (c) <%= grunt.template.today("yyyy") %> <%= _.capitalize(pkg.author.name) %> \n*/\n',

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					'<%= path.src %>/util/Globals.js',
					'<%= path.src %>/util/*.js',
					'<%= path.src %>/*.js'
				],
				dest: '<%= pkg.name %>.js'
			}
		},
		clean: {
			spec: [
				'_SpecRunner.html',
				'.grunt'
			]
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
				tasks: ['jshint:spec', 'test', 'notify:success']
			}
		},
		jasmine: {
			components: {
				src: [
					'<%= path.src %>/util/*js',
					'<%= path.src %>/**/*js'
				],
				options: {
					specs: 'test/*Spec.js',
					keepRunner: true,
					vendor: [
						'<%= path.vendors %>/jquery/jquery.min.js',
						'<%= path.vendors %>/greensock-js/src/minified/TweenLite.min.js',
						'<%= path.vendors %>/greensock-js/src/minified/TimelineLite.min.js',
						'<%= path.vendors %>/greensock-js/src/minified/easing/*.js',
						'<%= path.vendors %>/greensock-js/src/minified/plugins/*.js'
					]
				}
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
		}
	});


	// load all npm tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


	// grunt tasks
	grunt.registerTask('build', [
		'concat',
		'uglify'
	]);

	grunt.registerTask('test', 'Testing specs headless', [
		'jasmine'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	]);

};