'use strict';

angular.module('appControllerHome', [ 'soundcloudService', 'audioPlayerService', 'playListService' ] )
    
    /*
    * Home controller
    */
    .controller('HomeController', [ 'soundcloudRetriever', 'audioPlayer', 'playlist', HomeController ] )
    
    .directive('lastSong', function( audioPlayer, $timeout ) {
        return {
            restrict: 'AC',
            templateUrl: './js/components/home/last-song.html',
            scope: {
                item: '=itemdata'
            },
            link: function( scope, element, attrs ){
                // We bind each directive with audioPlayer
                element.bind( 'click', function(){
                    audioPlayer.playSound( scope.$parent.fav.id );
                });

                // Use timeout to to execute this function after dom is loaded.
                $timeout( function(){
                    // When all element have been rendered launch scrollReveal
                    if( scope.$parent.$last ){
                        audioPlayer.initialize();
                        // Transform all the data-sr with css animation
                        new scrollReveal();
                    }
                }.bind( scope ), 0 );
            }
        };
    });
    
    /*
    * Home constructor
    */
    function HomeController( soundcloudRetriever, audioPlayer, playlist ) {
        this.audioPlayer = audioPlayer;
        this.playlist = playlist;
        this.initialize();
        this.retrieveFavoritesSong( soundcloudRetriever );
    }

    /*
    * Initializer of HomeControlle
    */
    HomeController.prototype.initialize = function () {
        this.title = 'Home Controller';
        this.favorites = [];
    };

    /*
    * Use soundcloudRetriever Service to reach the Nodejs server Endpoint and retrieve updated list of songs.
    */
    HomeController.prototype.retrieveFavoritesSong = function ( soundcloudRetriever ) {
        soundcloudRetriever.retrieveFavoritesSong()
        .then(function(data){
            this.favorites = data;
        }.bind( this ), function(data){
            console.log( data );
        });
    };
    
    /*
    * Use to display artwork given by soundcloud or some default picture in case soundcloud doesn't provide one.
    */
    HomeController.prototype.getArtwork = function( artwork ) {
        if( artwork ){
            return artwork;
        } else {
            return 'http://ajournalofmusicalthings.com/wp-content/uploads/no_artwork_available.jpg';
        }
    };