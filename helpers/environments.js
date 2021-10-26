/*
 * Title: Environments
 * Description: Sets environments variables and credentials
 * Author: Saud
 * Date: 01-21-2021
 */

// Dependencies

// Module scaffolding
const environments = {};

// Configuration
environments.config = {};

// SET environments variables
environments.development = {
  name: 'development',
  port: 3001,
  secretKey: 'nodeabc',
  twilio: {
    from: 'xxxx', // from twilio console
    accountSid: 'ACxxxx', // from twilio console
    authToken: 'xxxx', // from twilio console
  },
  email: {
    service: 'gmail',
    auth: {
      user: 'xxxx', // gmail
      pass: 'xxxx', // gmail account password
    },
  },
};

environments.production = {
  name: 'production',
  port: 5000,
  secretKey: 'nodexyz',
  twilio: {
    from: 'xxxx', // from twilio console
    accountSid: 'ACxxxx', // from twilio console
    authToken: 'xxxx', // from twilio console
  },
  email: {
    service: 'gmail',
    auth: {
      user: 'xxxx', // gmail
      pass: 'xxxx', // gmail account password
    },
  },
};

const passedEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'development';

const envToExport =  typeof environments[passedEnv] === 'object' ? environments[passedEnv] : environments.development;

// Export module
module.exports = envToExport;
