var express = require( 'express' );
var app = express();
var config = require( './helpers/config.js' )();

var server = app.listen( config.port, function(){
	console.log('Express server listening on port ' + config.port);
});
var io = require('socket.io')( server );

var nunjucks = require( 'nunjucks' );
var path = require( 'path' );
var bodyParser = require('body-parser');
var compass = require('node-compass');

// Soundcloud Manager
var sc = require('./helpers/soundcloudManager');
var soundcloudClient = new sc( io );

// Route
var router = express.Router();
var route = require( './helpers/route.js' )( router, config, soundcloudClient );

// view engine setup
app.set( 'view engine', 'nunjucks' );
app.set( 'env', 'local' );

nunjucks.configure( path.join( __dirname, 'templates' ) , {
	autoescape: true,
	express: app,
	watch: true
} );

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
app.use( express.static( __dirname + '/public' ) );

app.use( compass( {
		project : './public/stylesheets',
		sass : 'sass',
		css : 'css',
		logging : true,
		cache: true
	} )
);

app.use( '/', router );