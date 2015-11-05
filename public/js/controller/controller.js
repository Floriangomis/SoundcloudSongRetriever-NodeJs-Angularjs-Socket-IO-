"use strict";

var module = angular.module( 'appControllers', [ 'appControllerHome', 'appControllerMix', 'ngNewRouter', 'playListService'] );

module.config( ['$componentLoaderProvider', componentLoaderConfig ] );

module.controller( 'RouteController',  [ '$router', RouteController ]);

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

function RouteController ( $router ) {
    $router.config([
      { path: '/', component: 'home' },
      { path: '/mix', component: 'mix' }
    ]);
}

module.controller( 'playerController',  [ 'playlist', PlayerController ]);

function PlayerController( playlist ){
    this.currentSong = playlist.getCurrentSongTitle();
}