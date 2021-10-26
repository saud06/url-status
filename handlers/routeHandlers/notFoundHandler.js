/*
 * Title: Not Found
 * Description: Hits here when no routes has been found
 * Author: Saud
 * Date: 01-21-2021
 */

// Dependencies

// Module scaffolding
const notFoundHandler = {};

// Configuration
notFoundHandler.config = {};

notFoundHandler.notFound = (reqObj, callback) => {
  console.log(reqObj);

  callback(404, {
    message: '404 error not found.',
  });
};

// Export module
module.exports = notFoundHandler;
