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
};

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
            // token lasts for only one hour
            var expires = helpers.addHour(1);
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
    // @todo assign constants to variables
    var id = validators.validateLength(data.queryStringObject.id, 20);
    if (id) {
      _data.read('tokens', id, function (error, tokenData) {
        if (!error && tokenData) {
          callback(200, tokenData);
        } else {
          callback(404, { Error: 'Token not found' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required field' });
    }
  },
  put(data, callback) {
    var id = validators.validateLength(data.payload.id, 20);
    var extend = validators.validateTrue(data.payload.extend);
    if (id && extend) {
      _data.read('tokens', id, function (error, tokenData) {
        if (!error && tokenData) {
          // ensure token has not expired
          // @todo put this in a helper
          if (tokenData.expires > Date.now()) {
            tokenData.expires = helpers.addHour(1);
            _data.update('tokens', id, tokenData, function (error) {
              if (!error) {
                callback(200);
              } else {
                callback(500, { Error: 'Could not update token' });
              }
            });
          } else {
            callback(400, { Error: 'Token has expired' });
          }
        } else {
          callback(400, { Error: 'Token does not exist' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required fields or invalid fields' });
    }
  },
  delete(data, callback) {
    var id = validators.validateLength(data.queryStringObject.id, 20);
    if (id) {
      _data.read('tokens', id, function (error, readData) {
        if (!error && readData) {
          _data.delete('tokens', id, function (error) {
            if (!error) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not delete token' });
            }
          });
        } else {
          callback(404, { Error: 'Token does not exist' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required field' });
    }
  },
  // verify if token id is valid for a given user
  verifyToken(id, phone, callback) {
    _data.read('tokens', id, function (error, tokenData) {
      if (!error && tokenData) {
        // check if token is for user and hasn't expired
        if (tokenData.phone === phone && tokenData.expires > Date.now()) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    })
  }
}

module.exports = tokenHandlers;
