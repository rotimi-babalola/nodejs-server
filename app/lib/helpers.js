/**
 * various helpers
 */

var crypto = require('crypto');
var config = require('./config');

var helpers = {
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
};



module.exports = helpers;
