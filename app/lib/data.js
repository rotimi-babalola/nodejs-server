/**
 * Library for storing and editing data
 */

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

var lib = {
  baseDir: path.join(__dirname, '/../.data/'),
  create(dir, filename, data, callback) {
    // open file for writing
    // wx flags fails if the file already exists
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx', function (error, fileDescriptor) {
      if (!error && fileDescriptor) {
        // convert data to string
        var stringData = JSON.stringify(data);

        // write to file and close it
        fs.writeFile(fileDescriptor, stringData, function (error) {
          if (!error) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing file')
              }
            });
          } else {
            callback('Error writing to file');
          }
        });
      } else {
        callback('Could not create new file may already exist');
      }
    });
  },

  read(dir, filename, callback) {
    fs.readFile(lib.baseDir + dir + '/' + filename + '.json', 'utf8', function (error, data) {
      if (!error && data) {
        callback(false, helpers.parseJSONToObject(data));
      } else {
        callback(error, data);
      }
    });
  },

  update(dir, filename, data, callback) {
    // open the file
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'r+', function (error, fileDescriptor) {
      console.log(fileDescriptor, 'file');
      if (!error && fileDescriptor) {
        var stringData = JSON.stringify(data);

        // Truncate the file
        fs.truncate(fileDescriptor, function (err) {
          if (!error) {
            fs.writeFile(fileDescriptor, stringData, function (error) {
              if (!error) {
                fs.close(fileDescriptor, function (error) {
                  if (!error) {
                    callback(false);
                  } else {
                    callback('Error closing the file')
                  }
                });
              } else {
                callback('Error writing to existing file');
              }
            });
          } else {
            callback('Error truncating file')
          }
        });
      } else {
        callback('Could not open file for updating it may not exist yet');
      }
    });
  },

  delete(dir, filename, callback) {
    // unlink the file
    fs.unlink(lib.baseDir + dir + '/' + filename + '.json', function (error) {
      if (!error) {
        callback(false);
      } else {
        callback('Could not delete file');
      }
    });
  }
};



module.exports = lib;
