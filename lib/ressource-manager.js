'use strict';

var _ = require('lodash-node');

function isModifiedSince(ressource, date) {
	var lastModification = new Date(ressource.created.date);
	if (ressource.alterations && ressource.alterations.length > 0) {
		lastModification = new Date(ressource.alterations[ressource.alterations.length - 1].date);
	}
	return lastModification > new Date(date);
}

var RessourceManager = function(dataBase, config) {

	return {

		create: function(req, res) {

			var ressource = new req.schema(req.body);

			ressource.created = {
				user: req.user._id,
				date: new Date().toGMTString()
			};

			ressource.save(function(error) {

				if (error) throw error;

				res.status(200).send(ressource);

			});
		},

		findOne: function(req, res) {

			var ressource = req.ressource;

			var ifModifiedSince = req.headers['if-modified-since'];

			if (ifModifiedSince && !isModifiedSince(ressource, ifModifiedSince)) {
				return res.status(304).send();
			}

			res.status(200).send(ressource);
		},

		find: function(req, res) {

			req.schema.find(req.query || {}, function(error, ressources) {

				if (error) throw error;

				var ifModifiedSince = req.headers['if-modified-since'];

				if (ifModifiedSince) {
					var modifiedRessources = _.filter(ressources, function(ressource) {
						if (ressource.alterations.length > 0) {
							return new Date(ressource.alterations[ressource.alterations.length - 1].date) > new Date(ifModifiedSince);
						} else {
							return new Date(ressource.created.date) > new Date(ifModifiedSince);
						}
					});

					if (modifiedRessources.length === 0) {
						return res.status(304).send();
					}
				}

				if (req.query.pluck) {
					return res.status(200).send(_.pluck(ressources, req.query.pluck));
				}

				res.status(200).send(ressources);

			});
		},

		update: function(req, res) {

			var ressource = _.assign(req.ressource, req.body);

			if (config.registerAlterations) {
				ressource.alterations.push({
					user: req.user._id,
					date: new Date().toGMTString()
				});
			}

			ressource.save(function(error) {

				if (error) throw error;

				res.status(200).send(ressource);

			});
		},

		destroy: function(req, res) {

			req.ressource.remove(function(error) {

				if (error) throw error;

				res.status(200).send();

			});
		},

		injectSchema: function(req, res, next, schemaName) {

			req.schema = dataBase.models[schemaName];
			req.schemaName = schemaName;

			next();
		},

		injectRessource: function(req, res, next, id) {

			req.schema.findById(id, function(error, ressource) {

				if (error) throw error;

				if (!ressource) {
					return res.status(404).send({
						message: 'La ressource ' + req.schemaName + ' ' + id + ' n\'existe pas!'
					});
				}

				req.ressource = ressource;

				next();
			});
		}
	};
}

module.exports = RessourceManager;