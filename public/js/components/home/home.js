'use strict';

angular.module( 'appControllerHome', [ 'soundcloudService', 'audioPlayerService', 'playListService' ] )
    
    /*
    * Home controller
    */
    .controller('HomeController', [ 'soundcloudRetriever', 'audioPlayer', 'playlist', '$rootScope', '$location', HomeController ] )
    
    .directive('lastsSong', function( audioPlayer, $timeout ) {
        return {
            restrict: 'AC',
            templateUrl: './js/components/home/lasts-song.html',
            scope: {
                item: '=itemdata',
                cat: '=itemcat'
            },
            link: function( scope, element, attrs ){
                scope.$parent.fav.element = element;
                // We bind each directive with audioPlayer
                if( scope.cat === 'home' ){
                    element.bind( 'click', function(){
                        audioPlayer.playSound( scope.$parent.fav.id, scope.$parent.fav.element[0], scope.item.mp3 );
                    } );
                }

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
    function HomeController( soundcloudRetriever, audioPlayer, playlist, $rootScope, $location ) {
        this.audioPlayer = audioPlayer;
        this.playlist = playlist;
        this.location = $location;
        this.initialize();
        this.retrieveFavoritesSong( soundcloudRetriever );
        console.log( 'Controlleur Home' );
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