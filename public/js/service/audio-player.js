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
		this.currentTime = 0;
		this.nextSongBtn = window.document.getElementById( 'player-next' );
		this.previousSongBtn = window.document.getElementById( 'player-previous' );
        this.replayBtn = window.document.getElementById( 'replay' );
        this.lastSongElement = null;
        this.playListElement = null;

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
        pauseCurrentSongIcon.call( this, this.playListElement.children[ playlist.currentSong ] );
		this.player.play();
	};

	var playPreviousSong = function(){
		this.player.src = playlist.getPrevSong();
        pauseCurrentSongIcon.call( this, this.playListElement.children[ playlist.currentSong ] );
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

    var pauseCurrentSongIcon = function( songElement ){

        this.lastSongElement.querySelector( 'span' ).className = "";
        this.lastSongElement.querySelector( 'span' ).classList.add( 'fa', 'fa-play', 'fa-1x' );
        this.lastSongElement.querySelector( 'span' ).parentNode.removeAttribute( 'style' );

        songElement.querySelector( 'span' ).className = "";
        songElement.querySelector( 'span' ).classList.add( 'fa', 'fa-pause', 'fa-1x' );
        songElement.querySelector( 'span' ).parentNode.style.opacity = 1;
        songElement.querySelector( 'span' ).parentNode.style.visibility = 'visible';

        this.lastSongElement = songElement;
    };
    
    var resumeCurrentSongIcon = function(){
        this.lastSongElement.querySelector( 'span' ).className = "";
        this.lastSongElement.querySelector( 'span' ).classList.add( 'fa', 'fa-play', 'fa-1x' );
    };

    this.playSound = function( id, songElement ){
        if( this.playListElement === null ){
            this.playListElement = songElement.parentElement;
        }

        if( this.lastSongElement === null ){
            this.lastSongElement = songElement;
        }
		var urlOfTheSong = playlist.getSong( id );

        if( this.player.src == urlOfTheSong ){
			if( this.player.paused ){
                // Put pause icon on the song clicked
                pauseCurrentSongIcon.call( this, songElement );
                resumePlayer.call( this );
			} else {
                // Put Resume icon on the song since the click pause the song
                resumeCurrentSongIcon.call( this );
				pausePlayer.call( this );
			}
		} else {
            // Put pause icon on the song clicked
            pauseCurrentSongIcon.call( this, songElement );
            this.player.src = urlOfTheSong;
            this.player.play();
		}
    };

});