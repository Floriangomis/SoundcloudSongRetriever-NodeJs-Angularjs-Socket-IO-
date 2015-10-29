var config = {
	local: {
		mode: 'local',
		port: 3000
	},
	staging: {
		mode: 'staging',
		port: 4000
	},
	production: {
		mode: 'production',
		port: 5000
	}
};

module.exports = function() {
	return config[ process.argv[ 2 ] ] ? config[ process.argv[2] ] : config[ 'local' ];
};