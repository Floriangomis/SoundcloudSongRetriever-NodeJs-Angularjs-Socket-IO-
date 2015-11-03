/*
* Service
* Main goal is to manage all playable song
* Keep the currentSong, give to the audio-player
* the next, previous song ...
*/

'use strict';

var audioPlayerService = angular.module( 'playListService', [ 'soundcloudService' ] );

audioPlayerService.service( 'playlist', [ 'soundcloudRetriever', function( soundcloudRetriever ){

    var playList = [];
    this.currentSong = 0;
    
    this.initialize = function(){
        // retrieve Cache.
        soundcloudRetriever.retrieveFavoritesSong()
        .then( function( data ){
            playList = data;
            bindSocketIo.call( this );
        })
    };

    this.getSong = function( id ){
        for (var i = 0; i < playList.length; i++) {
            if( playList[i].id === id ){
                this.currentSong = i;
                return playList[i].mp3;
            }
        }
        return false;
    };
    
    this.getNextSong = function(){
        if( playList[ this.currentSong + 1 ] ){
            this.currentSong = this.currentSong + 1;
            return playList[ this.currentSong ].mp3
        } else {
            return playList[ this.currentSong ].mp3
        }
    };
    
    this.getPrevSong = function(){
        if( playList[ this.currentSong - 1 ] ){
            this.currentSong = this.currentSong - 1;
            return playList[ this.currentSong ].mp3
        } else {
            return playList[ this.currentSong ].mp3
        }
    };

    var bindSocketIo = function(){
        var socket = io.connect('http://localhost:3000');
        socket.on('updateLinkSoundcloud', function ( data ) {
            playList = data;
        });
    };

}]);
    