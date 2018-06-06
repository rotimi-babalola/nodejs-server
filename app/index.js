/*
 * Primary file for the API
 *  
 */

// Dependencies
var http = require('http');
var https = require('https');
var fs = require('fs');

var config = require('./lib/config');
var unifiedServer = require('./unifiedServer');

// instantiating the server
var httpServer = http.createServer(function (request, response) {
  unifiedServer(request, response);
});

// start server and have it listen on port 3000
httpServer.listen(config.httpPort, function () {
  console.log(`Server is live on port ${config.httpPort}`);
});

var httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}

// instantiate https server
var httpsServer = https.createServer(httpsServerOptions, function (request, response) {
  unifiedServer(request, response);
});

// start https server
httpsServer.listen(config.httpsPort, function () {
  console.log(`HTTPS Server is live on port ${config.httpsPort}`);
});
