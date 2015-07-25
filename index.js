var express = require('express'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  http = require('http'),
  helmet = require('helmet');

var BaseApp = function() {

  return {

    init: function(port, callback) {

      // Initialize express app
      var app = express()
      app.set('server', http.createServer(app));

      app.use(morgan('dev'));

      // Use helmet to secure Express headers
      app.use(helmet.xframe());
      app.use(helmet.xssFilter());
      app.use(helmet.nosniff());
      app.use(helmet.ienoopen());
      app.disable('x-powered-by');

      // Enable CORS
      app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, If-Modified-Since');
        next();
      });

      app.options('*', function(req, res) {
        res.sendStatus(200);
      });

      app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
      }));

      app.use(bodyParser.json({
        limit: '50mb'
      }));

      app.use(methodOverride());

      // Start the app by listening on <port>
      app.get('server').listen(port, function() {
        callback();
      });
    }
  };
};

module.exports = BaseApp;