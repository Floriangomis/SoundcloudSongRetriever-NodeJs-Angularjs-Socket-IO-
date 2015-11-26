var mongoose = require('mongoose');
mongoose.connect( 'mongodb://localhost/otpo');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email: String,
    password: String,
    provider_id: String,
    provider: String,
    accessToken: String,
    refreshToken: String,
    createdAt: { type: Date, 'default': Date.now }
});

module.exports = mongoose.model( 'User', UserSchema, 'user' );
