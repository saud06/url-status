/*
 * Title: Token
 * Description: Token CRUD
 * Author: Saud
 * Date: 01-23-2021
 */

// Dependencies
const data = require('../../lib/data');
const utilities = require('../../helpers/utilities');

// Module scaffolding
const tokenHandler = {};

// Configuration
tokenHandler.config = {};

tokenHandler.token = (reqObj, callback) => {
  if (
    reqObj.method === 'get'
    || reqObj.method === 'post'
    || reqObj.method === 'put'
    || reqObj.method === 'delete'
  ) {
    // call tokenAction
    tokenHandler.tokenAction[reqObj.method](reqObj, callback);
  } else {
    callback(405, {
      message: 'Denied.',
    });
  }
};

tokenHandler.tokenAction = {};

// Get token
tokenHandler.tokenAction.get = (reqObj, callback) => {
  const id =
    typeof reqObj.queryStrObj.id === 'string' && reqObj.queryStrObj.id.trim().length === 20
      ? reqObj.queryStrObj.id
      : null;

  if (id) {
    data.read('tokenDataFolder', id, (err, tokenData) => {
      if (!err && tokenData) {
        // checking json data validity of 'tokenData' using 'utilities.parseJson' and,
        // copying the modified json data into the variable 'tokenDataObj' using spread operator
        const tokenDataObj = { ...utilities.parseJson(tokenData) };

        callback(200, {
          message: tokenDataObj,
        });
      } else {
        callback(400, {
          message: 'Token data not found.',
        });
      }
    });
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// Post token
tokenHandler.tokenAction.post = (reqObj, callback) => {
  const phone =    typeof reqObj.body.phone === 'string' && reqObj.body.phone.trim().length === 11
      ? reqObj.body.phone
      : null;
  const password =    typeof reqObj.body.password === 'string' && reqObj.body.password.trim().length === 6
      ? reqObj.body.password
      : null;

  if (phone && password) {
    data.read('userDataFolder', phone, (err, userData) => {
      if (!err && userData) {
        const userData2 = { ...utilities.parseJson(userData) };

        if (utilities.hash(password) === userData2.hashedPassword) {
          const tokenId = utilities.randomString(10);
          const expTime = Date.now() + 3600000; // 1 hour from creation time

          const tokenData = {
            phone,
            tokenId,
            expTime,
          };

          data.create('tokenDataFolder', tokenId, tokenData, (err2) => {
            if (!err2) {
              callback(200, {
                message: 'Token created successfully.',
              });
            } else {
              callback(500, {
                message: err2,
              });
            }
          });
        } else {
          callback(400, {
            message: 'Invalid password.',
          });
        }
      } else {
        callback(400, {
          message: 'User data not foundd',
        });
      }
    });
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// Put token
tokenHandler.tokenAction.put = (reqObj, callback) => {
  const id =
    typeof reqObj.body.id === 'string' && reqObj.body.id.trim().length === 20
      ? reqObj.body.id
      : null;

  const extend = typeof reqObj.body.extend === 'boolean' ? reqObj.body.extend : null;

  if (id && extend) {
    data.read('tokenDataFolder', id, (err, tokenData) => {
      if (!err && tokenData) {
        const tokenDataObj = { ...utilities.parseJson(tokenData) };

        if (tokenDataObj.expTime > Date.now()) {
          tokenDataObj.expTime = Date.now() + 3600000;

          data.update('tokenDataFolder', id, tokenDataObj, (err2) => {
            if (!err2) {
              callback(400, {
                message: 'Token updated successfully.',
              });
            } else {
              callback(400, {
                message: err2,
              });
            }
          });
        } else {
          callback(400, {
            message: 'Token already expired.',
          });
        }
      } else {
        callback(400, {
          message: 'Token data not found',
        });
      }
    });
  } else {
    callback(200, {
      message: 'Invalid user request.',
    });
  }
};

// Delete token
tokenHandler.tokenAction.delete = (reqObj, callback) => {
  const id =    typeof reqObj.queryStrObj.id === 'string' && reqObj.queryStrObj.id.trim().length === 20
      ? reqObj.queryStrObj.id
      : null;

  if (id) {
    data.read('tokenDataFolder', id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete('tokenDataFolder', id, (err2) => {
          if (!err2) {
            callback(400, {
              message: 'Token deleted successfully.',
            });
          } else {
            callback(500, {
              message: err2,
            });
          }
        });
      } else {
        callback(400, {
          message: 'Token data not found.',
        });
      }
    });
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// verufy token
tokenHandler.tokenAction.verify = (id, phone, callback) => {
  if (id && phone) {
    data.read('tokenDataFolder', id, (err, tokenData) => {
      if (!err && tokenData) {
        const tokenDataObj = { ...utilities.parseJson(tokenData) };

        if (tokenDataObj.phone === phone && tokenDataObj.expTime > Date.now()) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  } else {
    callback(false);
  }
};

// Export module
module.exports = tokenHandler;
