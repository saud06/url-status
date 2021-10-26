/*
 * Title: User
 * Description: User CRUD
 * Author: Saud
 * Date: 01-23-2021
 */

// Dependencies
const data = require('../../lib/data');
const utilities = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// Module scaffolding
const userHandler = {};

// Configuration
userHandler.config = {};

userHandler.user = (reqObj, callback) => {
  if (
    reqObj.method === 'get' ||
    reqObj.method === 'post' ||
    reqObj.method === 'put' ||
    reqObj.method === 'delete'
  ) {
    // call userAction
    userHandler.userAction[reqObj.method](reqObj, callback);
  } else {
    callback(405, {
      message: 'Denied.',
    });
  }
};

userHandler.userAction = {};

// Get user
userHandler.userAction.get = (reqObj, callback) => {
  // validate user
  const phone =    typeof reqObj.queryStrObj.phone === 'string' && reqObj.queryStrObj.phone.trim().length === 11
      ? reqObj.queryStrObj.phone
      : null;

  if (phone) {
    // Verify token
    const token =      typeof reqObj.headerObj.token === 'string' && reqObj.headerObj.token.trim().length === 20
        ? reqObj.headerObj.token
        : null;

    if (token) {
      tokenHandler.tokenAction.verify(token, phone, (tokenId) => {
        if (tokenId) {
          data.read('userDataFolder', phone, (err, userData) => {
            if (!err && userData) {
              // checking json data validity of 'userData' using 'utilities.parseJson' and,
              // copying modified json data into the variable 'userDataObj' using spread operator
              const userDataObj = { ...utilities.parseJson(userData) };

              // remove password property from user obj
              delete userDataObj.hashedPassword;

              callback(200, {
                message: userDataObj,
              });
            } else {
              callback(400, {
                message: 'User data not found',
              });
            }
          });
        } else {
          callback(403, {
            message: 'Authentication failed.',
          });
        }
      });
    } else {
      callback(400, {
        message: 'Token data not foundd',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// Post user
userHandler.userAction.post = (reqObj, callback) => {
  const firstName =    typeof reqObj.body.firstName === 'string' && reqObj.body.firstName.trim().length > 0
      ? reqObj.body.firstName
      : null;
  const lastName =    typeof reqObj.body.lastName === 'string' && reqObj.body.lastName.trim().length > 0
      ? reqObj.body.lastName
      : null;
  const phone =    typeof reqObj.body.phone === 'string' && reqObj.body.phone.trim().length === 11
      ? reqObj.body.phone
      : null;
  const password =    typeof reqObj.body.password === 'string' && reqObj.body.password.trim().length === 6
      ? reqObj.body.password
      : null;
  const tosAgreement =    typeof reqObj.body.tosAgreement === 'boolean' ? reqObj.body.tosAgreement : null;

  const hashedPassword = utilities.hash(password);

  if (firstName && lastName && phone && password && tosAgreement) {
    data.read('userDataFolder', phone, (err) => {
      if (err) {
        const userData = {
          firstName,
          lastName,
          phone,
          hashedPassword,
          tosAgreement,
        };

        data.create('userDataFolder', phone, userData, (err2) => {
          if (!err2) {
            callback(200, {
              message: 'User created successfully.',
            });
          } else {
            callback(500, {
              message: err2,
            });
          }
        });
      } else {
        callback(400, {
          message: 'Phone no already exists.',
        });
      }
    });
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// Put user
userHandler.userAction.put = (reqObj, callback) => {
  const firstName =    typeof reqObj.body.firstName === 'string' && reqObj.body.firstName.trim().length > 0
      ? reqObj.body.firstName
      : null;
  const lastName =    typeof reqObj.body.lastName === 'string' && reqObj.body.lastName.trim().length > 0
      ? reqObj.body.lastName
      : null;
  const phone =    typeof reqObj.body.phone === 'string' && reqObj.body.phone.trim().length === 11
      ? reqObj.body.phone
      : null;
  const password =    typeof reqObj.body.password === 'string' && reqObj.body.password.trim().length === 6
      ? reqObj.body.password
      : null;

  if (phone) {
    if (firstName || lastName || password) {
      // Verify token
      const token =
        typeof reqObj.headerObj.token === 'string' && reqObj.headerObj.token.trim().length === 20
          ? reqObj.headerObj.token
          : null;

      if (token) {
        tokenHandler.tokenAction.verify(token, phone, (tokenId) => {
          if (tokenId) {
            data.read('userDataFolder', phone, (err, userData) => {
              if (!err && userData) {
                const userData2 = { ...utilities.parseJson(userData) };

                if (firstName) {
                  userData2.firstName = firstName;
                }

                if (lastName) {
                  userData2.lastName = lastName;
                }

                if (password) {
                  userData2.password = utilities.hash(password);
                }

                data.update('userDataFolder', phone, userData2, (err2) => {
                  if (!err2) {
                    callback(200, {
                      message: 'User has been updated successfull.',
                    });
                  } else {
                    callback(500, {
                      message: err2,
                    });
                  }
                });
              } else {
                callback(400, {
                  message: 'User data not foundd',
                });
              }
            });
          } else {
            callback(403, {
              message: 'Authentication failed.',
            });
          }
        });
      } else {
        callback(400, {
          message: 'Token data not found.',
        });
      }
    } else {
      callback(400, {
        message: 'User data not found',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// Delete user
userHandler.userAction.delete = (reqObj, callback) => {
  // validate user
  const phone =    typeof reqObj.queryStrObj.phone === 'string' && reqObj.queryStrObj.phone.trim().length === 11
      ? reqObj.queryStrObj.phone
      : null;

  if (phone) {
    // Verify token
    const token =
      typeof reqObj.headerObj.token === 'string' && reqObj.headerObj.token.trim().length === 20
        ? reqObj.headerObj.token
        : null;

    if (token) {
      tokenHandler.tokenAction.verify(token, phone, (tokenId) => {
        if (tokenId) {
          data.read('userDataFolder', phone, (err, userData) => {
            if (!err && userData) {
              data.delete('userDataFolder', phone, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: 'User deleted successfully.',
                  });
                } else {
                  callback(500, {
                    message: err2,
                  });
                }
              });
            } else {
              callback(500, {
                message: 'User data not found',
              });
            }
          });
        } else {
          callback(403, {
            message: 'Authentication failed.',
          });
        }
      });
    } else {
      callback(400, {
        message: 'Token data not found.',
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// Export module
module.exports = userHandler;
