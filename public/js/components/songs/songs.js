'use strict';

angular.module( 'appControllerSongs', [ 'AuthService' ] )

    .controller('SongsController', [ '$http', 'Auth', '$rootScope', '$location', SongsController ] );

    function SongsController( $http, Auth, $rootScope, $location ) {
        this.songs = null;
        this.username = null;
        this.alertEmpty = false;
        this.processing = false;
        this.nothingToShare = false;
        this.http = $http;
        this.Auth = Auth
        console.log( 'Controlleur songs' );
    };
    
    SongsController.prototype.mySongs = function() {
        this.alertEmpty = false;
        this.nothingToshare = false;

        if( this.username ){
            var data = {
                    method: 'POST',
                    url: '/api/mySongs',
                    data: { user: this.username }
                };
                this.processing = true;
                this.http( data )
                .success( function( data ){
                    if( data.data ){
                        this.processing = false;
                        this.songs = data.data;
                        this.username = null;
                    }else{
                        this.processing = false;
                        this.nothingToshare = true;
                    }
                }.bind( this ) )
                .error(function( err ){
                    this.processing = false;
                    this.nothingToshare = true;
                }.bind( this ) );
        }else{
            this.alertEmpty = true;
        }
    };