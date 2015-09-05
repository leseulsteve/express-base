'use strict';

var express = require('express'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  http = require('http'),
  helmet = require('helmet');

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

  // Start the app by listening on <port>
  this.app.get('server').listen(config.port, function() {
    callback(this.app);
  });
};

BaseApp.prototype.setMailerService = function(mailer) {
  var mailer = require('./lib/mailer')(app);
  mailer.init(config.mailer, mailer);
};

module.exports = new BaseApp();