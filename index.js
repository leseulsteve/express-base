'use strict';

var express = require('express'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  http = require('http'),
  helmet = require('helmet'),
  glob = require('glob'),
  _ = require('lodash-node');

var BaseApp = function() {};

BaseApp.prototype.init = function(config, callback) {

  this.config = config;

  // Initialize express app
  this.app = express()
  this.app.set('server', http.createServer(this.app));

  this.app.use(morgan('dev'));

  // Use helmet to secure Express headers
  this.app.use(helmet.xframe());
  this.app.use(helmet.xssFilter());
  this.app.use(helmet.nosniff());
  this.app.use(helmet.ienoopen());
  this.app.disable('x-powered-by');

  // Enable CORS
  this.app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, If-Modified-Since');
    next();
  });

  this.app.options('*', function(req, res) {
    res.sendStatus(200);
  });

  this.app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));

  this.app.use(bodyParser.json({
    limit: '50mb'
  }));

  this.app.use(methodOverride());

  var that = this;
  // Start the app by listening on <port>
  this.app.get('server').listen(config.port, 127.0.0.1, function() {
    callback(that.app);
  });
};

BaseApp.prototype.setMailerService = function(mailer) {
  var mailerService = require('./lib/mailer');
  mailerService.init(this.config.mailer, mailer, this.app);
};

BaseApp.prototype.initDynamicRouter = function(database, config) {
  require('./lib/router')(this.app, database, config);
};

BaseApp.prototype.getBaseSchema = function() {
  return require('./lib/base-schema');
};

BaseApp.prototype.getGlobbedFiles = function(globPatterns, removeRoot) {
  // For context switching
  var _this = this;

  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function(globPattern) {
      output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      glob(globPatterns, {
        sync: true
      }, function(err, files) {
        if (removeRoot) {
          files = files.map(function(file) {
            return file.replace(removeRoot, '');
          });
        }

        output = _.union(output, files);
      });
    }
  }

  return output;
};

module.exports = new BaseApp();