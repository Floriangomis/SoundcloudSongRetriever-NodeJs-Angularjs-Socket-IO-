var jwt = require( 'jsonwebtoken' );
var settings = require( './settings.js' );

module.exports.issueToken = function( payload ){
    var token = jwt.sign( payload, settings.jwt.superSecret, { expiresInMinutes: settings.jwt.expiresInMinutes } );
    return token;
};

module.exports.verifyToken = function( token, verified ){
        return jwt.verify( token, settings.jwt.superSecret, verified );
};