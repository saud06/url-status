/*
 * Title:
 * Description:
 * Author: Saud
 * Date:
 */

// Dependencies
const crypto = require('crypto');
const environments = require('./environments');

// Module scaffolding
const utilities = {};

// Configuration
utilities.config = {};

// Parse string to object
utilities.parseJson = (jsonString) => {
  let output = {};

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

// Generate hashed string
utilities.hash = (strToHash) => {
  if (typeof strToHash === 'string' && strToHash.length > 0) {
    const hashedStr = crypto
      .createHmac('sha256', environments.secretKey)
      .update(strToHash)
      .digest('hex');

    return hashedStr;
  }

  return false;
};

// Generate random alphanumeric string
utilities.randomString = (strLen) => {
  if (typeof strLen === 'number' && strLen > 0) {
    const tokenStr = crypto.randomBytes(strLen).toString('hex');

    return tokenStr;
  }

  return false;
};

// Export module
module.exports = utilities;
