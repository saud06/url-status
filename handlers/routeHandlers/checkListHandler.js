/*
 * Title: Check List
 * Description: Check list CRUD
 * Author: Saud
 * Date: 01-26-2021
 */

// Dependencies
const data = require('../../lib/data');
const utilities = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// Module scaffolding
const checkListHandler = {};

// Configuration
checkListHandler.config = {};

checkListHandler.checkList = (reqObj, callback) => {
  if (
    reqObj.method === 'get'
    || reqObj.method === 'post'
    || reqObj.method === 'put'
    || reqObj.method === 'delete'
  ) {
    // call checkListAction
    checkListHandler.checkListAction[reqObj.method](reqObj, callback);
  } else {
    callback(405, {
      message: 'Denied.',
    });
  }
};

checkListHandler.checkListAction = {};

// Get checkList
checkListHandler.checkListAction.get = (reqObj, callback) => {
  // validate checkList
  const id =
    typeof reqObj.queryStrObj.id === 'string' && reqObj.queryStrObj.id.trim().length === 20
      ? reqObj.queryStrObj.id
      : null;

  if (id) {
    // Verify token
    const token =
      typeof reqObj.headerObj.token === 'string' && reqObj.headerObj.token.trim().length === 20
        ? reqObj.headerObj.token
        : null;

    if (token) {
      data.read('tokenDataFolder', token, (err, tokenData) => {
        if (!err && tokenData) {
          const tokenDataObj = { ...utilities.parseJson(tokenData) };
          const tokenPhone = tokenDataObj.phone;

          data.read('userDataFolder', tokenPhone, (err2, userData) => {
            if (!err2 && userData) {
              tokenHandler.tokenAction.verify(token, tokenPhone, (tokenIsValid) => {
                if (tokenIsValid) {
                  data.read('checkListDataFolder', id, (err3, checkListData) => {
                    if (!err3 && checkListData) {
                      const checkListDataObj = { ...utilities.parseJson(checkListData) };

                      callback(200, {
                        message: checkListDataObj,
                      });
                    } else {
                      callback(400, {
                        message: 'Check list data not found',
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
                message: 'User data not foundd',
              });
            }
          });
        } else {
          callback(400, {
            message: 'Token data not foundd',
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

// Post checkList
checkListHandler.checkListAction.post = (reqObj, callback) => {
  const protocol =
    typeof reqObj.body.protocol === 'string' && ['http', 'https'].indexOf(reqObj.body.protocol) > -1
      ? reqObj.body.protocol
      : null;

  const url =
    typeof reqObj.body.url === 'string' && reqObj.body.url.trim().length > 0
      ? reqObj.body.url
      : null;

  const allowedMethod = ['GET', 'POST', 'PUT', 'DELETE'];

  const method =
    typeof reqObj.body.method === 'string' && allowedMethod.indexOf(reqObj.body.method) > -1
      ? reqObj.body.method
      : null;

  const statusCode =
    typeof reqObj.body.statusCode === 'object' && reqObj.body.statusCode instanceof Array
      ? reqObj.body.statusCode
      : null;

  const timeout =    typeof reqObj.body.timeout === 'number' && reqObj.body.timeout >= 1
      ? reqObj.body.timeout
      : null;

  if (protocol && url && method && statusCode && timeout) {
    // Verify token
    const token =
      typeof reqObj.headerObj.token === 'string' && reqObj.headerObj.token.trim().length === 20
        ? reqObj.headerObj.token
        : null;

    if (token) {
      data.read('tokenDataFolder', token, (err, tokenData) => {
        if (!err && tokenData) {
          const tokenDataObj = { ...utilities.parseJson(tokenData) };
          const tokenPhone = tokenDataObj.phone;

          data.read('userDataFolder', tokenPhone, (err2, userData) => {
            if (!err2 && userData) {
              tokenHandler.tokenAction.verify(token, tokenPhone, (tokenIsValid) => {
                if (tokenIsValid) {
                  const userDataObj = { ...utilities.parseJson(userData) };
                  const userCheckList =                    typeof userDataObj.ckList === 'object' && userDataObj.ckList instanceof Array
                      ? userDataObj.ckList
                      : [];

                  if (userCheckList.length < 5) {
                    // Check list ID
                    const id = utilities.randomString(10);

                    const checkListObj = {
                      id,
                      tokenPhone,
                      protocol,
                      url,
                      method,
                      statusCode,
                      timeout,
                    };

                    data.create('checkListDataFolder', id, checkListObj, (err3) => {
                      if (!err3) {
                        userDataObj.ckList = userCheckList;
                        userDataObj.ckList.push(id);

                        data.update('userDataFolder', tokenPhone, userDataObj, (err4) => {
                          if (!err) {
                            callback(200, {
                              message: 'Check list created succesfully.',
                            });
                          } else {
                            callback(500, {
                              message: err4,
                            });
                          }
                        });
                      } else {
                        callback(500, {
                          message: err3,
                        });
                      }
                    });
                  } else {
                    callback(400, {
                      message: 'User check list reached the maximum limit.',
                    });
                  }
                } else {
                  callback(403, {
                    message: 'Authentication failed.',
                  });
                }
              });
            } else {
              callback(400, {
                message: 'User data not found.',
              });
            }
          });
        } else {
          callback(400, {
            message: 'Token data not found.',
          });
        }
      });
    }
  } else {
    callback(400, {
      message: 'Invalid user request.',
    });
  }
};

// Put checkList
checkListHandler.checkListAction.put = (reqObj, callback) => {
  const id =
    typeof reqObj.queryStrObj.id === 'string' && reqObj.queryStrObj.id.trim().length === 20
      ? reqObj.queryStrObj.id
      : null;

  const protocol =
    typeof reqObj.body.protocol === 'string' && ['http', 'https'].indexOf(reqObj.body.protocol) > -1
      ? reqObj.body.protocol
      : null;

  const url =
    typeof reqObj.body.url === 'string' && reqObj.body.url.trim().length > 0
      ? reqObj.body.url
      : null;

  const allowedMethod = ['GET', 'POST', 'PUT', 'DELETE'];

  const method =
    typeof reqObj.body.method === 'string' && allowedMethod.indexOf(reqObj.body.method) > -1
      ? reqObj.body.method
      : null;

  const statusCode =
    typeof reqObj.body.statusCode === 'object' && reqObj.body.statusCode instanceof Array
      ? reqObj.body.statusCode
      : null;

  const timeout =    typeof reqObj.body.timeout === 'number' && reqObj.body.timeout >= 1
      ? reqObj.body.timeout
      : null;

  if (id) {
    if (protocol || url || method || statusCode || timeout) {
      // Verify token
      const token =
        typeof reqObj.headerObj.token === 'string' && reqObj.headerObj.token.trim().length === 20
          ? reqObj.headerObj.token
          : null;

      if (token) {
        data.read('tokenDataFolder', token, (err, tokenData) => {
          if (!err && tokenData) {
            const tokenDataObj = { ...utilities.parseJson(tokenData) };
            const tokenPhone = tokenDataObj.phone;

            tokenHandler.tokenAction.verify(token, tokenPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                data.read('checkListDataFolder', id, (err2, checkListData) => {
                  if (!err2 && checkListData) {
                    const checkListDataObj = { ...utilities.parseJson(checkListData) };

                    if (protocol) {
                      checkListDataObj.protocol = protocol;
                    }

                    if (url) {
                      checkListDataObj.url = url;
                    }

                    if (method) {
                      checkListDataObj.method = method;
                    }

                    if (statusCode) {
                      checkListDataObj.statusCode = statusCode;
                    }

                    if (timeout) {
                      checkListDataObj.timeout = timeout;
                    }

                    data.update('checkListDataFolder', id, checkListDataObj, (err3) => {
                      if (!err3) {
                        callback(200, {
                          message: 'check list has been updated successfull.',
                        });
                      } else {
                        callback(500, {
                          message: err3,
                        });
                      }
                    });
                  } else {
                    callback(400, {
                      message: 'Check list data not foundd',
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

// Delete checkList
checkListHandler.checkListAction.delete = (reqObj, callback) => {
  // validate user
  const id =    typeof reqObj.queryStrObj.id === 'string' && reqObj.queryStrObj.id.trim().length === 20
      ? reqObj.queryStrObj.id
      : null;

  if (id) {
    // Verify token
    const token =
      typeof reqObj.headerObj.token === 'string' && reqObj.headerObj.token.trim().length === 20
        ? reqObj.headerObj.token
        : null;

    if (token) {
      data.read('tokenDataFolder', token, (err, tokenData) => {
        if (!err && tokenData) {
          const tokenDataObj = { ...utilities.parseJson(tokenData) };
          const tokenPhone = tokenDataObj.phone;

          data.read('userDataFolder', tokenPhone, (err2, userData) => {
            if (!err2 && userData) {
              tokenHandler.tokenAction.verify(token, tokenPhone, (tokenIsValid) => {
                if (tokenIsValid) {
                  data.read('checkListDataFolder', id, (err3, checkListData) => {
                    if (!err3 && checkListData) {
                      data.delete('checkListDataFolder', id, (err4) => {
                        if (!err4) {
                          const userDataObj = { ...utilities.parseJson(userData) };
                          const userCkList = userDataObj.ckList;

                          if (userCkList.indexOf(id) > -1) {
                            userCkList.splice(userDataObj.ckList.indexOf(id), 1);

                            data.update('userDataFolder', tokenPhone, userDataObj, (err5) => {
                              if (!err5) {
                                callback(200, {
                                  message: 'Check list deleted successfully.',
                                });
                              } else {
                                callback(500, {
                                  message: err5,
                                });
                              }
                            });
                          }
                        } else {
                          callback(500, {
                            message: err4,
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
                message: 'User data not found.',
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
module.exports = checkListHandler;
