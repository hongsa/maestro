// Generated on 2015-01-21 using generator-angular 0.9.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'src',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/app/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 2000,
        // Change this to '0.0.0.0' to access the server from outside.
        //hostname: 'localhost',
        hostname: '192.168.0.62',
        livereload: 34729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/app/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
/*    wiredep: {
      options: {
        cwd: '<%= yeoman.app %>'
      },
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },
*/
    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/app/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/*.css'],
      // js: [
      //   '<%= yeoman.dist %>/app/**/*.js',
      //   '<%= yeoman.dist %>/*.js'
      // ],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/styles'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= yeoman.dist %>',
    //       src: 'styles/*.css',
    //       dest: '<%= yeoman.dist %>'
    //     }]
    //   }
    // },
    // uglify: {
    //   build: {
    //     files: [{
    //         expand: true,
    //         src: '**/*.js',
    //         dest: '<%= yeoman.dist %>/app',
    //         cwd: '<%= yeoman.app %>/app'
    //     }]
    //   },
    //   options: {
    //     mangle:false
    //   },
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: [
            '*.html',
            'app/**/*.html'
          ],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/app',
          src: [
            '*.js'
          ],
          dest: '.tmp/concat/app'
        }]
      }
    },
    // ngAnnotate: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= yeoman.app %>/app',
    //       src: '**/*.js',
    //       dest: '<%= yeoman.dist %>/app',
    //     }]
    //   }
    // },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand : true,
          dot : true,
          cwd : '.tmp',
          dest : '<%= yeoman.dist %>',
          src : [
            '*.html'
          ]
        // }, {
      //     expand: true,
      //     dot: true,
      //     cwd: '<%= yeoman.app %>',
      //     dest: '<%= yeoman.dist %>',
      //     src: ['**']
      //   }, {
      //     expand:true,
      //     cwd:'bower_components',
      //     dest:'<%= yeoman.dist %>/bower_components',
      //     src:['**']
      //   }, {
      //     expand: true,
      //     cwd: '.tmp/images',
      //     dest: '<%= yeoman.dist %>/images',
      //     src: ['generated/*']
      //   }, {
      //     expand: true,
      //     cwd: 'bower_components/bootstrap/dist',
      //     src: 'fonts/*',
      //     dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    preprocess : {
      index : {
        src : 'src/index.html',
        dest : '.tmp/index.html'
      },
      template : {
        src : '**/*.html',
        cwd : 'src/app',
        dest : '.tmp/app',
        expand : true
      },
      css: {
        src : '*.css',
        cwd : 'src/styles',
        dest : '.tmp/styles',
        expand : true
      },
      js : {
        src : '**/*.js',
        cwd : 'src/app',
        dest : '.tmp/app',
        expand : true
      }
    },

    includeSource: {
      options: {
        basePath: '.tmp',
        baseUrl: '/'
      },
      dist: {
        files: {
          '.tmp/index.html': '.tmp/index.html'
        }
      }
    },

    ngtemplates : {
      'dataDashboard' : {
        cwd : '.tmp',
        src : 'app/**/*.html',
        dest : '.tmp/app/templates.js',
        options : {
          htmlmin :  '<%= htmlmin.app %>',
          usemin : 'app/app.js'
        }
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // AWS credentials
    //aws: grunt.file.readJSON("aws-global.json"),

    // upload to S3
    // s3: {
    //   options: {
    //     accessKeyId: '<%= aws.accessKeyId %>',
    //     secretAccessKey: '<%= aws.secretAccessKey %>',
    //     bucket: 'classting-dashboard',
    //     region: 'ap-northeast-1'
    //   },
    //   build: {
    //     cwd: './dist/',
    //     src: '**'
    //   }
    // },

    compress: {
      main: {
        options: {
          mode: 'tgz',
          archive: 'build/dashboard.tar.gz'
        },
        files: [{
          expand: true,
          src: '**/*',
          cwd: 'dist/',
          dot: true
        }]
      },
      sitemap : {
        files : [{
          src : '<%= yeoman.dist %>/sitemap.xml',
          dest :'<%= yeoman.dist %>/sitemap.xml.gz'
        }]
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', 'Build artifact', function() {
    grunt.task.run([
      'clean:dist',
      'preprocess:index',
      'preprocess:template',
      'preprocess:css',
      'preprocess:js',
      'includeSource:dist',
      'useminPrepare',
      'autoprefixer',
      'ngtemplates',
      'concat',
      'ngAnnotate',
      'copy:dist',
      'cssmin',
      'uglify',
      'filerev',
      'usemin',
      'htmlmin'
    ]);
  });

  grunt.registerTask('deploy', 'Upload application to S3', function() {
    grunt.task.run(['s3']);
  });

  // grunt.registerTask('build', [
  //   'clean:dist',
  //   'concurrent:dist',
  //   'copy:dist',
  //   'cssmin',
  //   'ngAnnotate',
  //   'uglify',
  //   'htmlmin'
  // ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
