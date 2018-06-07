/**
 * various helpers
 */

var crypto = require('crypto');
var config = require('./config');

var helpers = {
  // @TODO refactor this to use a salt
  hash(string) {
    if (typeof string === 'string' && string.length) {
      return crypto.createHmac('sha256', config.hashSecret).update(string).digest('hex');
    }
    return false;
  },
  parseJSONToObject(string) {
    try {
      var object = JSON.parse(string);
      return object;
    } catch (error) {
      return {};
    }
  },
  createRandomString(stringLength) {
    if (typeof stringLength === 'number' && stringLength > 0) {
      return crypto.randomBytes(Math.ceil(stringLength / 2))
        .toString('hex');
    }
    return false;
  },
  addHour(hours) {
    // adds a specified number of hours to the current time
    return Date.now() + (hours * 1000 * 60 * 60);
  },
};



module.exports = helpers;
