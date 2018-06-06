/**
 * create and export config variables
 */

// container for all the environments
var environments = {
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashSecret: 'EsteEsElSecreto',
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashSecret: 'EsteEsElSecretoDos',
  }
};

// determine which env was passed via command line argument
var currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that current env is valid
var envToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// export the module
module.exports = envToExport;
