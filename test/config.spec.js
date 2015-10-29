describe("Configuration setup", function() {
	it("should load local configurations", function(next) {
		var config = require('../js/helpers/config')();
		expect(config.mode).toBe('local');
		next();
	});
	it("should load staging configurations", function(next) {
		var config = require('../js/helpers/config')('staging');

		expect(config.mode).toBe('staging');
		next();
	});
	it("should load production configurations", function(next) {
		var config = require('../js/helpers/config')('production');
		expect(config.mode).toBe('production');
		next();
	});
});