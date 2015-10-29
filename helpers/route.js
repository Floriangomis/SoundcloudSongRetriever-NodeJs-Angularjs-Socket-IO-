var settings = require( './settings.js' );
var apiArticle = require( '../api/articleApi.js' );
var http = require( 'http' );

var settingsToArray = function( settingsFiles ){
	var array = [];

	for (var key in settingsFiles ){
		array.push( settingsFiles[ key ] );
	}

	return array;
}

module.exports = function( router, config, soundcloudClient ){
	// Route Middleware
	router.use(function(req, res, next) {
		// log each request to the console
		console.log(req.method, req.url);
		// continue doing what we were doing and go to the route
		next();
	});

	// GLOBAL ROUTE
	router.get( '/', function( req, res ){
		res.render( 'layout/base.html' );
	} );


	// REST API - ARTICLE -- Unused for now.
	// router.get( '/api/article/:id', apiArticle.getArticle );
	// router.get( '/api/articles', apiArticle.getArticles );
	// router.post( '/api/article', apiArticle.createArticle );
	// router.put( '/api/article/:id', apiArticle.updateArticle );
	// router.put( '/api/article/:id', apiArticle.deleteArticle );
	
	
	// Soundcloud
	var soundcloudFavorites = function( req, res ){
 		res.json( soundcloudClient.getFavoritesArray() );
	};
	router.get( '/soundcloudFavorites', soundcloudFavorites );

};
