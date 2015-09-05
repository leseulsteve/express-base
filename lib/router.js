'use strict';

var Router = function(app, database, config) {

	var ressourceManager = require('./ressource-manager')(database, config),
		ressourceAuthorization = require('./ressource-authorization');

	var root = '/' + config.apiRoot + '/:ressourceName';

	app.route(root)
		.all(ressourceAuthorization)
		.get(ressourceManager.find)
		.post(ressourceManager.create);

	app.route(root + '/:ressourceId')
		.all(ressourceAuthorization)
		.get(ressourceManager.findOne)
		.put(ressourceManager.update)
		.delete(ressourceManager.destroy);

	app.param('ressourceName', ressourceManager.injectSchema);
	app.param('ressourceId', ressourceManager.injectRessource);

}

module.exports = Router;