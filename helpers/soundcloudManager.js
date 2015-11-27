var soundcloud = require('soundcloud-nodejs-api-wrapper');
var settings = require( './settings.js' );
var request = require('request');
var schedule = require('node-schedule');
var Q = require('q');

var SoundcloudManager = function( io ){
    this.io = io;
    this.initialize.call( this );
};

module.exports = SoundcloudManager;
    
SoundcloudManager.prototype.initialize = function(){
    var arrayOfFavoritesTracks = null;

    this.sc = new soundcloud({
        client_id : settings.configSoundcloud.client_id,
        client_secret : settings.configSoundcloud.client_secret,
        username : settings.configSoundcloud.username,
        password: settings.configSoundcloud.password
    });
    
    this.client = this.sc.client();
    this.client.exchange_token( function( err, token ) {
        if( err ){
            console.log( 'Erreur exchange_token : ' err );
        }
        this.soundcloudClient = this.sc.client( { access_token : token } );
        this.getFavorites.call( this );
        
        var j = schedule.scheduleJob(' */1 * * * *', function(){
            console.log('refresh list mp3');
            this.getFavorites.call( this );
        }.bind( this ));
    }.bind( this ) );
    
};

SoundcloudManager.prototype.getSongId = function( url ){
    var deferred = Q.defer();
    this.soundcloudClient.get('/resolve', { url: url }, function( err, result ) {
        request( {
            url: result.location,
            followRedirect: false },
            function( error, response, body ){
                deferred.resolve( JSON.parse( body ).id );
            }
        )
    });
    return deferred.promise;
};

SoundcloudManager.prototype.getUrlWithId = function ( id ){
    var deferred = Q.defer();
    request( {
        url: 'https://api.soundcloud.com/tracks/'+ id +'/stream?client_id=' + settings.randomKeySoundcloud() ,
        followRedirect: false },
        function( error, response, body ){
            if( error ){
                deferred.reject( error );
            }
            deferred.resolve( response.headers['location'] );
        }
    )
    return deferred.promise;
};

SoundcloudManager.prototype.get = function( path, params ){
    this.soundcloudClient.get(path, { limit : params.limit ? params.limit : null }, function( err, result ) {
        if (err){
            console.error(err);
        }
        return result;
    });
};

var sortById = function( a, b ) {
    if (a.id === b.id) {
        return 0;
    }
    else {
        return (a.id > b.id) ? -1 : 1;
    }
};

var handleSuccess = function ( result, track, tracks, error, response, body ){
    // Allow to know if we reach the limit.
    var sound = { 
        title: result[track].title,
        perma_link: result[track].permalink,
        artwork: result[track].artwork_url ? result[track].artwork_url.replace( 'large', 't500x500') : '',
        uri: result[track].uri,
        id: result[track].id,
        mp3: response.headers['location']
    };

    if( sound.mp3 ){
        tracks.push( sound );
    } else {
        // If a tracks doesn't get any location then reduce the number of expected result.
        tracks[ 'result' ] = tracks[ 'result' ] - 1;
    }
    
    if( tracks.length === tracks[ 'result' ] ){
        // We sort the songs by ID
        tracks.sort( sortById );
        this.io.emit( 'updateLinkSoundcloud', tracks );
    }
};

SoundcloudManager.prototype.getFavorites = function (){
    this.soundcloudClient.get('/users/florian-gomis/favorites', { limit: 200 }, function( err, result ) {
        if( result ){
            var tracks = [];
            // We keep a trace of the number of result sent by soundcloud
            tracks[ 'result' ] = result.length;
        }
        if(err){
            console.error(err);
        }
        for( var track in result ){
            request( {
                url: 'https://api.soundcloud.com/tracks/'+ result[track].id +'/stream?client_id=' + settings.randomKeySoundcloud(),
                followRedirect: false },
                handleSuccess.bind( this, result, track, tracks )
            )
        }
        arrayOfFavoritesTracks = tracks;
    }.bind( this ) );
};

SoundcloudManager.prototype.getFavoritesArray = function (){
    return arrayOfFavoritesTracks;
};

var handleSuccessMySongs = function( result, track, tracks, deferred, error, response, body ){
    // Allow to know if we reach the limit.
    var sound = {
        title: result[track].title,
        perma_link: result[track].permalink,
        artwork: result[track].artwork_url ? result[track].artwork_url.replace( 'large', 't500x500') : '',
        uri: result[track].uri,
        id: result[track].id,
        mp3: response.headers['location']
    };

    if( sound.mp3 ){
        tracks.push( sound );
    } else {
        // If a tracks doesn't get any location then reduce the number of expected result.
        tracks[ 'result' ] = tracks[ 'result' ] - 1;
    }

    if( tracks.length === tracks[ 'result' ] ){
        // We sort the songs by ID
        tracks.sort( sortById );
        deferred.resolve( tracks );
    }
};

SoundcloudManager.prototype.getMySongs = function( user ){
    var deferred = Q.defer();

    this.soundcloudClient.get('/users/' + user + '/favorites', { limit: 200 }, function( err, result ) {
        if( result ){
            if( result.length === 0 ){
                deferred.resolve( null );
            }
            var tracks = [];
            // We keep a trace of the number of result sent by soundcloud
            tracks[ 'result' ] = result.length;
        }
        if( result === undefined ){
            deferred.reject( null );
        }
        if( err ){
            deferred.reject( err );
        }

        for( var track in result ){
            request( {
                url: 'https://api.soundcloud.com/tracks/'+ result[track].id +'/stream?client_id=' + settings.randomKeySoundcloud(),
                followRedirect: false },
                handleSuccessMySongs.bind( this, result, track, tracks, deferred )
            );
        }
    }.bind( this ) );
    return deferred.promise;
};