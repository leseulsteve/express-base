// Generated on 2013-11-14 using generator-angular-fullstack 0.2.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    express: {
        options: {
            port: process.env.PORT || 9000
        },
        dev: {
            options: {
                script: 'server.js'
            }
        },
        prod: {
            options: {
                script: 'server.js',
                'node_env': 'production'
            }
        }
    },

    watch: {
      express: {
          files: [
              'server.js',
              'src/{,*//*}*.{js,json}'
          ],
          tasks: ['express:dev'],
          options: {
              livereload: true,
              nospawn: true //Without this option specified express won't be reloaded
          }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },
    
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/{,*/}*.js'
      ]
    },

    shell: {
      mongo: {
        command: 'mongod --dbpath node_modules/gestigris-backend/db --smallfiles',
        options: {
          async: true
        }
      }
    },
  });

  grunt.registerTask('server', ['shell:mongo', 'express:dev', 'watch']);
};
