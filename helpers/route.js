var settings = require( './settings.js' );
var apiArticle = require( '../api/articleApi.js' );
var User = require('../api/userApi');
var jwt = require('./jwt.js');


module.exports = function( router, config, soundcloudClient, passport ){

	/////////////
	// WITHOUT TOKEN
	/////////////

	// Create a fake User
	router.post('/authenticate', function( req, res, next ){
		var email = req.body.email;
		var password = req.body.password;

		// look for the user named chris
		User.findOne( { email: email }, function( err, user ) {
			// if there is no chris user, create one
			if( !user ){
				var sampleUser = new User();
				sampleUser.email = email;
				sampleUser.password = password;
				sampleUser.save();

				var token = jwt.issueToken( { email: sampleUser.email } );

				res.status( 200 ).send( {
					success: true,
					message: 'Enjoy your token!',
					token: token
		        } );

			}else{
				// Password compare
				if( password === user.password ){
					var token = jwt.issueToken( { email: user.email } );
					res.status( 200 ).send( {
			          success: true,
			          message: 'Enjoy your token!',
			          token: token
			        } );
				}else{
					res.status( 404 ).send( {
						success: true,
						message: 'Email or password incorrect'
					} );
				}
			}
		} );
	} );

	// SOUNDCLOUD
	router.get( '/soundcloudFavorites', function( req, res ){
		res.json( soundcloudClient.getFavoritesArray() );
	} );

	// SOUNDCLOUD
	router.post( '/mySongs', function( req, res ){
		soundcloudClient.getMySongs( req.body.user )
		.then( function( data ){
			res.status( 200 ).send( {
				success: true,
				data: data
			} );
		}, function( data ){
			res.status( 404 ).send( {
				success: true,
				data: data
			} );
		} )
		;
	} );

	// Allow to retrieve a url to download a song from soundcloud
	router.post( '/retrieveUrlSong', function( req, res ){
		if( req.body.song ){
			soundcloudClient.getSongId( req.body.song )
			.then( function( value ){
				return soundcloudClient.getUrlWithId( value );
			})
			.then( function( value ){
				res.status( 200 ).send( {
					success: true,
					message: 'Enjoy your mp3!',
					url: value
				} );
			} );
		}else{
			res.status( 400 ).send( {
				success: false,
				message: 'Please make sure you entered an url',
			} );
		}
	} );

	// OAUTH PROVIDER
	router.get( '/auth/twitter', passport.authenticate( 'twitter' ) );
	router.get( '/auth/twitter/callback', passport.authenticate( 'twitter', { successRedirect: '/auth/success', failureRedirect: '/auth/failure' } ) );
	router.get( '/auth/soundcloud', passport.authenticate( 'soundcloud' ) );
	router.get( '/auth/soundcloud/callback', passport.authenticate( 'soundcloud', { successRedirect: '/auth/success', failureRedirect: '/auth/failure' } ) );
	router.get( '/auth/success', function( req, res ){
		res.render('after_auth.html', { state: 'success', user: req.user.username } );
	} );
	router.get( '/auth/failure', function( req, res ){
		res.render('after_auth.html', { state: 'failure', user: null });
    } );

	// route middleware to verify a token
	router.use( function(req, res, next){
		console.log( req.method, req.url );

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.otpo_token;
		// decode token
		if (token) {
		// verifies secret and checks exp
		jwt.verifyToken(token, function(err, decoded){
			if (err){
				res.status(403).send( {
					success: false,
					message: 'Failed to authenticate token.'
				} );
			}else{
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next(); // make sure we go to the next routes and don't stop here
			}
		});
		} else {
		// return an HTTP response of 403 (access forbidden) and an error message in case there is no token
			res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
	});

	////////////////
	// WITH TOKEN //
	////////////////

	// Simple test with token.
	router.get( '/testApi', function( req, res ){
		res.status( 200 ).send( {
			success: true,
			message: 'Token correct'
		} );
	} );
	// Retrieve information of the connected user.
	router.post( '/me', function( req, res ){
		// look for the user named chris
		User.findOne( { email: req.body.email }, function( err, user ) {
			if( err ){
				res.status( 404 ).send( {
					succes: false,
					message: err
				} );
			}else{
				res.status( 200 ).send( {
					success: true,
					data: user
				} );
			}
		} );
	} );

	// REST API - ARTICLE -- Unused for now.
	// router.get( '/api/article/:id', apiArticle.getArticle );
	// router.get( '/api/articles', apiArticle.getArticles );
	// router.post( '/api/article', apiArticle.createArticle );
	// router.put( '/api/article/:id', apiArticle.updateArticle );
	// router.put( '/api/article/:id', apiArticle.deleteArticle );
};
