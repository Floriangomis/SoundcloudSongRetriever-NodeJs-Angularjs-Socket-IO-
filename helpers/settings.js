var configSoundcloud = {
	client_id : "YOUR_CLIENT_ID",
	client_secret : "YOUR_CLIENT_SECRET",
	username : 'YOUR_SOUNDCLOUD_ACCOUNT',
	password: 'YOUR_PASSWORD'
}

var arrayOfKeys = [
	// Put your different keys
];

var randomKeySoundcloud = function(){
	return arrayOfKeys[ Math.floor( Math.random() * arrayOfKeys.length ) ];
};

var passportKey = {
	twitter: {
		consumerKey: 'YOUR_CONSUMER_KEY',
		consumerSecret: 'YOUR_CONSUMER_SECRET',
		callbackURL: 'YOUR_CALLBACK_URL'
	},
	soundcloud: {
		clientId: 'YOUR_CLIENT_ID',
		clientSecret: 'YOUR_CLIENT_SECRET',
		callbackURL: 'YOUR_CALLBACK_URL'
	}
};

var jwt = {
	superSecret: 'YOUR_SUPER_SECRET',
	expiresInMinutes: 20
}

module.exports = {
	randomKeySoundcloud: randomKeySoundcloud,
	configSoundcloud: configSoundcloud,
	passportKey: passportKey,
	jwt: jwt
};