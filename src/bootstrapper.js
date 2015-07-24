var fs = require('fs'),
	path = require('path'),
	_ = require('lodash-node'),
	nodeModulesDir = './node_modules';

function getNodeModuleDirectories() {
	return fs.readdirSync(nodeModulesDir).filter(function(file) {
		return fs.statSync(path.join(nodeModulesDir, file)).isDirectory();
	});
}

exports.init = function(app) {
	var customModulesDirectories = _.filter(getNodeModuleDirectories(), function(dirName) {
		return _.startsWith(dirName, 'gestigris');
	});
	_.forEach(customModulesDirectories, function(customModulesDirectory) {
		require(customModulesDirectory)(app);
	});
};