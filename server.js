var express = require( 'express' );
var app = express();
var server = require('http').Server( app );

var config = require( './helpers/config.js' )();

var mongoose = require('mongoose');

var cookieParser = require('cookie-parser')
var passport = require( 'passport' );
var pm = require( './helpers/passportManager' );
var passportManager = new pm( passport );

var session = require( 'express-session' );
var MongoDBStore = require('connect-mongodb-session')(session);

server.listen( config.port );
var io = require('socket.io')( server );

var nunjucks = require( 'nunjucks' );
var path = require( 'path' );
var bodyParser = require('body-parser');

// Soundcloud Manager
var sc = require('./helpers/soundcloudManager');
var soundcloudClient = new sc( io );

// Route
var router = express.Router();
var route = require( './helpers/route.js' )( router, config, soundcloudClient, passport );

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
app.use( cookieParser() );
app.use( express.static( __dirname + '/public' ) );

var store = new MongoDBStore(
	{
		uri: 'mongodb://localhost:27017/mongodb_session',
		collection: 'mySessions'
	});
	// Catch errors
	store.on('error', function( error ){
		assert.ifError( error );
		assert.ok(false);
	}
);

app.use( session( {
					secret: 'keyboardcat',
					store: store,
					name: 'cookie'
				}
			)
		);
app.use( passport.initialize() );
app.use( passport.session() );

app.use( '/api', router );

app.get( '*', function( req, res ){
	res.render( 'layout/base.html' );
} );