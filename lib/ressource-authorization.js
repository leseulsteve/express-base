'use strict';

function ressourceAuthorization(req, res, next) {

  var options = {};

  switch (req.method) {
    case 'POST':
      options.operation = 'CREATE';
      options.verb = 'creer';
      break;
    case 'GET':
      options.operation = 'READ';
      options.verb = 'lire';
      break;
    case 'PUT':
      options.operation = 'UPDATE';
      options.verb = 'modifier';
      break;
    case 'DELETE':
      options.operation = 'DELETE';
      options.verb = 'supprimer';
      break;
    default:
      return res.status(405).send({
        message: 'Méthode ' + req.method + ' innexistante pour ' + req.schemaName
      });
  }

  if (!req.schema.can(options.operation, req.user)) {
    return res.status(403).send({
      message: 'Vous n\'êtes pas autorisez à ' + options.verb + ' ' + req.schemaName
    });
  }
  next();
}

module.exports = ressourceAuthorization;