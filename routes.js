/*
 * Title: Routes
 * Description: Contains all routes of the app
 * Author: Saud
 * Date: 01-21-2021
 */

// Dependencies
const userHandler = require('./handlers/routeHandlers/userHandler');
const tokenHandler = require('./handlers/routeHandlers/tokenHandler');
const checkListHandler = require('./handlers/routeHandlers/checkListHandler');

// Module scaffolding
const routes = {
  user: userHandler.user,
  token: tokenHandler.token,
  checkList: checkListHandler.checkList,
};

// Configuration
routes.config = {};

// Export module
module.exports = routes;
