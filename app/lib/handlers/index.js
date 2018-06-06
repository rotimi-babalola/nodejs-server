var user = require('./user.handlers');
var token = require('./token.handlers');
var ping = require('./ping.handlers');
var notFound = require('./notFound.handlers');

var handlers = {
  user,
  token,
  ping,
  notFound,
}

module.exports = handlers;
