var config = require('./config/config'),
  express = require('express'),
  bodyParser = require('body-parser'),
  bootstrapper = require('./src/bootstrapper.js');


// Initialize express app
var app = express()
app.set('server', http.createServer(app));

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

app.use(bodyParser.urlencoded({
  extended: true
}));

bootstrapper.init(app);

// Start the app by listening on <port>
app.get('server').listen(config.port, function() {
  console.log(chalk.green.bgBlue.bold('Le serveur écoute maintenant sur le port ' + config.port));
});