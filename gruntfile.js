module.exports = function( grunt ){

    grunt.initConfig({
        // Allow to export here all META-DATA from package.json
        pkg: grunt.file.readJSON( 'package.json' );
    });

};