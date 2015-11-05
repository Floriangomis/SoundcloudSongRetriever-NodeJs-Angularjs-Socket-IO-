module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    // Entry point of the app
                    "public/js/app.js",
                    // Service
                    "public/js/service/soundcloudRetriever.js",
                    "public/js/service/audio-player.js",
                    "public/js/service/playlist.js",
                    // Controllers
                    "public/js/controller/controller.js",
                    // Components
                    "public/js/components/home/home.js",
                    "public/js/components/mix/mix.js"
                ],
                dest: 'public/min/<%= pkg.name %>.js'
            }
        },

        watch: {
            files: 'src/**/*.js',
            tasks: ['concat']
        },
    });

    grunt.registerTask('default', ['concat']);

};