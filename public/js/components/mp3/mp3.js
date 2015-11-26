'use strict';

angular.module( 'appControllerMp3', [ 'AuthService' ] )

    .controller( 'Mp3Controller', [ '$http', 'Auth', Mp3Controller ] );

    var checkIfUrl = function( url ){
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        return url.match(regex);
    };

    function Mp3Controller( $http, Auth ) {
        this.Auth = Auth;
        this.http = $http;
        this.song = '';
        this.processing = false;
        this.downloadBtn = null;
        console.log( 'Controlleur MP3' );
    }

    Mp3Controller.prototype.testCallApi = function() {
        this.http ( {
            method: 'GET',
            url: '/api/test'
        } ).success(function( data ){
            console.log( 'Success Test Call on api' );
        } ).error(function( err ){
            console.log( err );
        } );
    };

    Mp3Controller.prototype.retrieveSong = function() {
        this.downloadBtn = null;
        if( this.song && checkIfUrl( this.song ) ){
            this.processing = true;
            this.http( {
                method: 'POST',
                data: { song: this.song },
                url: '/api/retrieveUrlSong'
            } ).then( function successCallback( response ){
                this.downloadBtn = response.data.url;
                this.processing = false;
            }.bind( this ), function errorCallback( response ){
                console.log( response );
            } );
        } else {
            alert( 'Veuillez inserer une URL' );
        }
    };

    Mp3Controller.prototype.connectTwitter = function() {
        this.Auth.connectTwitter();
    };

    Mp3Controller.prototype.connectSoundcloud = function() {
        this.Auth.connectSoundcloud();
    };

    Mp3Controller.prototype.logout = function() {
        this.Auth.logout();
    };