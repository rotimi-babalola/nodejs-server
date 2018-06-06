/**
 * These are request handlers
 */

// Dependencies
var validators = require('./validation');
var _data = require('./data');
var helpers = require('./helpers');

var handlers = {
  // not found
  notFound(data, callback) {
    callback(404);
  },
  ping(data, callback) {
    callback(200)
  },
  users(data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.includes(data.method)) {
      handlers._users[data.method](data, callback);
    } else {
      callback(405);
    }
  }
};

// containers for users sub-methods
handlers._users = {
  post(data, callback) {
    var firstName = validators.validateName(data.payload.firstName);
    var lastName = validators.validateName(data.payload.lastName);
    var phone = validators.validateLength(data.payload.phone, 10);
    var password = validators.validateLength(data.payload.password);
    var tosAgreement = validators.validateTOS(data.payload.tosAgreement);

    if (firstName && lastName && phone && password && tosAgreement) {
      _data.read('users', phone, function (error, data) {
        if (error) {
          var hashedPassword = helpers.hash(password);

          if (hashedPassword) {
            var userObject = {
              firstName,
              lastName,
              phone,
              hashedPassword,
              tosAgreement,
            }

            _data.create('users', phone, userObject, function (error) {
              if (!error) {
                callback(200);
              } else {
                console.log(error);
                callback(500, { error: 'Could not create the user' });
              }
            });
          } else {
            callback(500, { error: 'Could not hash password' })
          }
        } else {
          // user already exists
          callback(400, { error: 'User with phone number exists' });
        }
      });
    } else {
      callback(400, { error: 'Missing required fields' });
    }
  },
  // @TODO only allow authenticated user access
  // their object
  get(data, callback) {
    var phone = validators.validateLength(data.queryStringObject.phone, 10);
    if (phone) {
      _data.read('users', phone, function (error, readData) {
        if (!error && readData) {
          delete readData.hashedPassword;
          callback(200, readData);
        } else {
          callback(404, { Error: 'User does not exist' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required field' });
    }
  },
  // required data: phone number
  // Optional data: firstName, lastName, password (at least one should be specified)
  // Only allow authed users to update their own details
  put(data, callback) {
    // check for required field
    var phone = validators.validateLength(data.queryStringObject.phone, 10);

    // check for optional field
    var firstName = validators.validateName(data.payload.firstName);
    var lastName = validators.validateName(data.payload.lastName);
    var password = validators.validateLength(data.payload.password);

    if (phone) {
      if (firstName || lastName || password) {
        // lookup
        _data.read('users', phone, function (error, userData) {
          if (!error && userData) {
            // update
            userData = { ...userData, firstName, lastName, hashedPassword: helpers.hash(password) };
            // update
            _data.update('users', phone, userData, function (err) {
              if (!err) {
                callback(200);
              } else {
                console.log(error);
                callback(500, { Error: 'Something went wrong with updating' });
              }
            })
          } else {
            callback(404, { Error: 'The specified user does not exist' });
          }
        });
      } else {
        callback(400, { Error: 'Missing fields to update' });
      }
    } else {
      callback(400, { Error: 'Missing required fields' })
    }

  },
  delete(data, callback) {
    var phone = validators.validateLength(data.queryStringObject.phone, 10);
    if (phone) {
      _data.read('users', phone, function (error, readData) {
        if (!error && readData) {
          _data.delete('users', phone, function (error) {
            if (!error) {
              callback(200);
            } else {
              callback(500, { Error: 'Could not delete user' });
            }
          });
        } else {
          callback(404, { Error: 'User does not exist' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required field' });
    }
  }
}

module.exports = handlers;
