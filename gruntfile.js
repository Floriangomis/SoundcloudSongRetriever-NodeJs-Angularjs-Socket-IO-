module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

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
                    "public/js/service/authentification.js",
                    // Controllers
                    "public/js/controller/controller.js",
                    // Components
                    "public/js/components/home/home.js",
                    "public/js/components/mp3/mp3.js",
                    "public/js/components/songs/songs.js",
                    "public/js/components/login/login.js"
                ],
                dest: 'public/min/<%= pkg.name %>.js'
            }
        },

        jshint:{
            options: {
                globalstrict: true,
                  globals: {
                    angular: true,
                    window: true,
                    io: true
                  },
                },
            all:[ 'public/js/service/*.js', 'public/js/components/*.js', 'public/js/controller/*.js' ]
        },

        watch: {
            files: 'public/**/*.js',
            tasks: ['concat']
        },
    });

    grunt.registerTask( 'default', ['concat', 'jshint', 'watch'] );

};