'use strict';

module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			build: ['bootstrap-components/', 'tmp/'],
			tmp: ['tmp/'],
		},
		concat: {
			js: {
				src: [
					'src/common/bootstrap-common.js',
					'src/**/*.js',
				],
				dest: 'tmp/public/js/bootstrap-components.js'
			},
			css: {
				src: [
					'src/common/bootstrap-common.css',
					'src/**/*.css',
				],
				dest: 'tmp/public/css/bootstrap-components.css'
			},
		},
		uglify: {
			js: {
				options: {
					compress: {},
					sourceMap: true,
				},
				src: 'tmp/public/js/bootstrap-components.js',
				dest: 'tmp/public/js/bootstrap-components.min.js'
			}
		},
		cssmin: {
			css: {
				files: {
					'tmp/public/css/bootstrap-components.min.css': ['tmp/public/css/bootstrap-components.css']
				}
			}
		},
		copy: {
			ui: {
				files: [
					{expand: true, cwd: 'tmp/public/', src: ['**'], dest: 'bootstrap-components'},
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['clean:build','concat', 'uglify', 'cssmin', 'copy', 'clean:tmp']);

	/*grunt.registerTask('default', [
		// Clean Env
		'clean:build',
		// Compress JS
		'concat:app',
		'regex-replace:strict',
		'uglify',
		'concat:js',
		// Compress CSS
		'cssmin',
		'concat:css',
		// Pass HTML Resources
		'htmlrefs',
		'copy',
		// Clean Env
		'clean:tmp',
	]);*/
};