var mongoose = require('mongoose');

var articleSchema = {
						title : String,
						date : String,
						author : String,
						content : String,
						artwork : String
					};

var Article = mongoose.model( 'Article', articleSchema, 'article' );

var getArticles = function( req, res ){
	Article.find( function( err, doc ){
		if( err ){
			console.log( err );
		}
		else{
			res.json( doc );
		}
	});
};

var getArticle = function( req, res ){
	Article.findById( req.params.id, function( err, doc ){
		if( err ){
			console.log( err );
		}
		else{
			res.json( doc );
		}
	});
};

var createArticle = function( req, res ){
	Article.create( {	title: req.body.title,
						date: req.body.date,
						author: req.body.author,
						content: req.body.content,
						artwork: req.body.artwork
					}, function( err, post ){
		if( err ){
			console.log( err );
		}
		else{
			res.json( post );
		}
	} );
};

var deleteArticle = function( req, res ){
	Article.findByIdAndRemove( req.params.id, function( err, post ){
		if ( err ){
			return next( err );
		}
		res.json( post );
	});
};

var updateArticle = function( req, res ){
	Article.findByIdAndUpdate( req.params.id, req.body, function( err, post ){
		if ( err ){
			return next( err );
		}
		res.json( post );
	});
};

// Public API
module.exports = {
	getArticles : getArticles,
	getArticle : getArticle,
	createArticle : createArticle,
	deleteArticle : deleteArticle,
	updateArticle : updateArticle
};