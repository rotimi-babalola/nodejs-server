var validators = require('../validation');
var _data = require('../data');
var helpers = require('../helpers');

var tokenHandlers = {
  tokens(data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.includes(data.method)) {
      tokenHandlers._tokens[data.method](data, callback);
    } else {
      callback(405);
    }
  }
}

tokenHandlers._tokens = {
  // required phone and password
  post(data, callback) {
    var phone = validators.validateLength(data.payload.phone, 10);
    var password = validators.validateLength(data.payload.password);

    if (phone && password) {
      // lookup user
      _data.read('users', phone, function (error, userData) {
        if (!error && userData) {
          var hashedPassword = helpers.hash(password);
          if (hashedPassword === userData.hashedPassword) {
            // create token
            var tokenId = helpers.createRandomString(20);
            // @todo put this in a helper
            var expires = Date.now() + 1000 + 60 * 60;
            var tokenObject = {
              phone,
              id: tokenId,
              expires,
            }
            // store token
            _data.create('tokens', tokenId, tokenObject, function (err) {
              if (!error) {
                callback(200, tokenObject)
              } else {
                callback(500, { Error: 'Could not create token' });
              }
            });
          } else {
            callback(401, { Error: 'Passwords do not match' });
          }
        } else {
          callback(404, { Error: 'Could not find the user' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required fields' });
    }
  },
  get(data, callback) {

  },
  put(data, callback) {

  },
  delete(data, callback) {
    //
  }
}

module.exports = tokenHandlers;
