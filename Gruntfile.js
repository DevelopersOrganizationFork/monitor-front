module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            js: {
                files: ['js/**/*.js'],
                tasks: [/*'concat'*/]
            },
            html: {
                files: ['templates/**/*.html', 'index.html'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['bootstrap.js']
            }
        },
        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: ['js/**/*.js', '!js/libs/*.js'],
                dest: 'bootstrap.js'
            }
        }
    });

    grunt.registerTask('default', ['watch']);
};