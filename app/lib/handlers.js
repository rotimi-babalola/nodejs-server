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
    var tosAgreement = typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement === true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
      _data.read('users', phone, function (error, data) {
        if (error) {
          var hashPassword = helpers.hash(password);

          if (hashPassword) {
            var userObject = {
              firstName,
              lastName,
              phone,
              hashPassword,
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
  get(data, callback) {

  },
  put(data, callback) {

  },
  delete(data, callback) {

  }
}

module.exports = handlers;
