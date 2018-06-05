/*
 * Primary file for the API
 *  
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

// server should respond to all requests with a string
var server = http.createServer(function (request, response) {
  // get url and parse it
  var parsedUrl = url.parse(request.url, true);

  // get the path name
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the query string as an object
  var queryStringObject = parsedUrl.query;

  // get HTTP method
  var method = request.method.toLowerCase();

  // get headers as an object
  var headers = request.headers;

  // Get payload if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  // everytime the data streams in the request object emits
  // the data event we are binding and it sends us undecoded 
  // data which we decode to utf8 and append the result to the 
  // buffer
  request.on('data', function (data) {
    console.log('I am called');
    buffer += decoder.write(data);
  });

  request.on('end', function () {
    buffer += decoder.end();

    // choose the handler request goes to if not found
    // use not found router
    var chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct data to send to handler
    var data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    // route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // use code called by handler or default to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // use payload called by handler or default to {}
      payload = typeof payload === 'object' ? payload : {};

      // convert payload to a string
      var payloadString = JSON.stringify(payload);

      // return response
      response.setHeader('Content-Type', 'application/json');
      response.writeHead(statusCode);
      response.end(payloadString);

      // Log request headers
      console.log('Returning this response ', statusCode, payloadString);
    });
  });
});

// start server and have it listen on port 3000
server.listen(config.port, function () {
  console.log(`Server is live on port ${config.port} in ${config.envName} mode`);
});

// Define handlers 
var handlers = {};

// sample handlers
handlers.sample = function (data, callback) {
  // callback a HTTP status code and a payload object
  callback(200, { name: 'My name is sample' });
}

// not found
handlers.notFound = function (data, callback) {
  callback(404);
}

// Define a request router
var router = {
  'sample': handlers.sample,
}
