/*
* Service
* In charge of playing song given by the playlist.
* It use Javascript Audio Player.
*/

'use strict';

var audioPlayerService = angular.module( 'audioPlayerService', [ 'playListService' ] );

audioPlayerService.service( 'audioPlayer', function( playlist ){
    
    this.initialize = function(){
        this.player = window.document.getElementsByTagName( 'audio' )[0];
        this.tracks = null;
		this.currentTime = 0;
		this.nextSongBtn = window.document.getElementById( 'player-next' );
		this.previousSongBtn = window.document.getElementById( 'player-previous' );
        this.replayBtn = window.document.getElementById( 'replay' );

        playlist.initialize();

		bindAudioEvent.call( this );
	};

	var playNextSong = function(){
        // If replay is checked then replay the song
        if( this.replayBtn.checked ){
            this.currentTime = 0;
            this.player.play();
            return ;
        }

		this.player.src = playlist.getNextSong();
		this.player.play();
	};
	
	var playPreviousSong = function(){
		this.player.src = playlist.getPrevSong();
		this.player.play();
	};

	var bindAudioEvent = function(){
		this.player.onended = playNextSong.bind( this )
		this.nextSongBtn.addEventListener( 'click', playNextSong.bind( this ) );
		this.previousSongBtn.addEventListener( 'click', playPreviousSong.bind( this ) );
	};

    var resumePlayer = function(){
		this.player.currentTime = this.currentTime;
		this.player.play();
	};

	var pausePlayer = function(){
		this.currentTime = this.player.currentTime;
		this.player.pause();
	};

    this.playSound = function( id ){
		var urlOfTheSong = playlist.getSong( id );

        if( this.player.src == urlOfTheSong ){
			if( this.player.paused ){
                resumePlayer.call( this );
			} else {
				pausePlayer.call( this );
			}
		} else {
			this.player.src = urlOfTheSong;
            this.player.play();
		}
    };

});