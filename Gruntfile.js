'use strict()';

var config= {
	port: 3000
};

module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		express: {
			options: {
				port: config.port
			},
			dev: {
				options: {
					script: 'keystone.js',
					debug: true
				}
			}
		},

		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				force: true
			},
			all: [ 'routes/**/*.js',
						 'models/**/*.js'
			],
			server: [
				'./keystone.js'
			]
		},

		concurrent: {
			dev: {
				tasks: ['nodemon', 'node-inspector', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		'node-inspector': {
			custom: {
				options: {
					'web-host': 'localhost'
				}
			}
		},

		nodemon: {
			debug: {
				script: 'keystone.js',
				options: {
					nodeArgs: ['--debug'],
					env: {
						port: config.port
					}
				}
			}
		},

		sass: {
			dev: {
				options: {
					style: 'expanded',
					compass: true
				},
				files: {
					'public/styles/main.css': 'assets/sass/main.scss'
				}
			},
			dist: {
				options: {
					style: 'compressed',
					compass: true
				},
				files: {
					'public/styles/main.min.css': 'assets/sass/main.scss'
				}
			}
		},

		uglify: {
			dev: {
				options: {
					compress: false,
					mangle: false,
					beautify: true,
				},
				files: {
					'public/js/main.js': 'assets/js/main.js'
				},
			},
			dist: {
				options:{
					compress: true,
					mangle: true
				},
				files: {
					'public/js/main.min.js': 'assets/js/main.js'
				},
			},
		},

		copy: {
			dist: {
				expand: true,
				cwd: 'assets/bower_components/',
				src: '**',
				dest: 'public/js/lib/bower_components/',
				flatten: false,
				/*filter: 'isFile',*/
			},
			sass: {
				expand: true,
				cwd: 'assets/sass/',
				src: '**',
				dest: 'public/styles/sass/',
				flatten: false,
			}
		},

		watch: {
			sass: {
		    files: 'assets/sass/*.{scss,sass}',
		    tasks: ['sass:dev','copy:sass'],
		  },
		  scripts: {
		  	files: 'assets/js/*.js',
		  	tasks: 'uglify:dev'
		  },
			js: {
				files: [
					'model/**/*.js',
					'routes/**/*.js'
				],
				tasks: ['jshint:all']
			},
			express: {
				files: [
					'keystone.js',
					'public/js/lib/**/*.{js,json}'
				],
				tasks: ['jshint:server', 'concurrent:dev']
			},
			livereload: {
				files: [
					'public/styles/**/*.css',
					'assets/sass/*.{scss,sass}',
					'templates/**/*.hbs',
					'node_modules/keystone/templates/**/*.jade'
				],
				options: {
					livereload: true
				}
			}
		}
	});

	// load jshint
	grunt.registerTask('lint', function(target) {
		grunt.task.run([
			'jshint'
		]);
	});

	// default option to connect server
	grunt.registerTask('serve', function(target) {
		grunt.task.run([
			'jshint',
			'concurrent:dev'
		]);
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve:' + target]);
	});

	grunt.registerTask('default', ['sass:dev','uglify:dev','copy']);
	grunt.registerTask('buildProd', ['sass:dist','uglify:dist','copy']);

};
