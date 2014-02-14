module.exports = function(grunt) {

	// configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					'js/*.js'
				],
				dest: 'js/build/production.js',
			}
		},
		jshint: {
			ignore_warning: {
				options: {
					"-W099": true,
				},
				beforeconcat: ['js/*.js'],
				afterconcat: ['js/build/production.js']
			},
		},
		uglify: {
			build: {
				src: 'js/build/production.js',
				dest: 'js/build/production.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};