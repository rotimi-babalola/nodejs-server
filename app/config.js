/**
 * create and export config variables
 */

// container for all the environments
var environments = {
  staging: {
    port: 3000,
    envName: 'staging',
  },
  production: {
    port: 5000,
    envName: 'production',
  }
};

// determine which env was passed via command line argument
var currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that current env is valid
var envToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// export the module
module.exports = envToExport;
