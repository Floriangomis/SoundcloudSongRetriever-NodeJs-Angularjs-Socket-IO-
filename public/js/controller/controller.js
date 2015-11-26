"use strict";

var module = angular.module( 'appControllers', [ 'appControllerHome', 'appControllerMp3', 'appControllerLogin', 'appControllerSongs','ngNewRouter', 'playListService'] );

module.config( ['$componentLoaderProvider', componentLoaderConfig ] );

module.controller( 'RouteController',  [ '$router', 'Auth', RouteController ]);

// Lower case string
function dashCase( str ) {
  return str.replace(/([A-Z])/g, function ( $1 ) {
     return '-' + $1.toLowerCase();
  });
}

// Change the path where to find template
function componentLoaderConfig( $componentLoaderProvider ) {
     $componentLoaderProvider.setTemplateMapping( function ( name ) {
          var dashName = dashCase( name );
          // customized to use app prefix
          return './js/components/' + dashName + '/' + dashName + '.html';
     });
}

function RouteController ( $router, Auth ) {
    $router.config([
        { path: '/', component: 'home' },
        // { path: '/login', component: 'login' },
        { path: '/songs', component: 'songs' },
        { path: '/mp3', component: 'mp3' }
    ]);
    this.Auth = Auth;
}

/*
* Use to display artwork given by soundcloud or some default picture in case soundcloud doesn't provide one.
*/
RouteController.prototype.getArtwork = function( artwork ) {
    if( artwork ){
        return artwork;
    } else {
        return 'http://ajournalofmusicalthings.com/wp-content/uploads/no_artwork_available.jpg';
    }
};

RouteController.prototype.logout = function(){
    this.Auth.logout();
};

module.controller( 'playerController',  [ 'playlist', PlayerController ]);

function PlayerController( playlist ){
    this.currentSong = playlist.getCurrentSongTitle();
}