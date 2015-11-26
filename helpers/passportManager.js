var passport = require('passport');
var User = require('../api/userApi');
var TwitterStrategy = require('passport-twitter').Strategy;
var SoundcloudStrategy = require('passport-soundcloud').Strategy;
var settings = require( './settings.js' );

var passportManaver = function( passport ){
    this.passport = passport;
    this.initialize.call( this );
};

module.exports = passportManaver;
    
passportManaver.prototype.initialize = function(){
    this.passport.serializeUser( function( user, done ) {
        done( null, user );
    } );

    this.passport.deserializeUser( function( obj, done ) {
        done( null, obj );
    } );

    bindTwitter.call( this );
    bindSoundcloud.call( this );
};

var bindTwitter = function(){
    this.passport.use(new TwitterStrategy( {
            consumerKey: settings.passportKey.twitter.consumerKey,
            consumerSecret: settings.passportKey.twitter.consumerSecret,
            callbackURL: settings.passportKey.twitter.callbackURL
        },
        function( token, tokenSecret, profile, done ){            
            User.findOne( { 'provider_id': profile.id }, function ( err, user ){
                if (err){ 
                    return done(err);
                }
                // If user doesn't exist then create it.
                if ( !user ) {
                    user = new User({
                        name: profile.username,
                        email: null,
                        username: profile.username,
                        provider_id: profile.id,
                        provider: 'twitter',
                        accessToken: token,
                        refreshToken: tokenSecret
                    });
                    user.save( function ( err ) {
                        if ( err ) {
                            console.log( err );
                            done( err );
                        }
                        done( null, { userId: profile.id, username: profile.username, accessToken: token, refreshToken: tokenSecret } );
                    });
                // else just create a session
                }else{
                    done( null, { userId: profile.id, username: profile.username, accessToken: token, refreshToken: tokenSecret } );
                }
            });
        }
    ));
};

var bindSoundcloud = function(){
    this.passport.use( new SoundcloudStrategy( {
        clientID: settings.passportKey.soundcloud.clientId,
        clientSecret: settings.passportKey.soundcloud.clientSecret,
        callbackURL: settings.passportKey.soundcloud.callbackURL
        },
        function( accessToken, refreshToken, profile, done ){
            User.findOne( { 'provider_id': profile.id }, function ( err, user ){
                if (err){ 
                    return done(err);
                }
                // If user doesn't exist then create it.
                if ( !user ) {
                    user = new User({
                        username: profile.displayName,
                        provider_id: profile.id,
                        provider: 'soundcloud',
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    });
                    user.save( function ( err ) {
                        if ( err ) {
                            console.log( err );
                            done( err );
                        }
                        done( null, { userId: profile.id, username: profile.displayName } );
                    });
                // else just create a session
                }else{
                    done( null, { userId: profile.id, username: profile.username } );
                }
            });
        }
    ) );
};