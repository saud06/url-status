/*
 * Title: Server
 * Description: Starts the server
 * Author: Saud
 * Date: 01-27-2021
 */

// Dependencies
const http = require('http');
const reqResHelper = require('../helpers/reqResHelper');
const environment = require('../helpers/environments');

// Module scaffolding
const server = {};

// Configuration
server.config = {};

server.createServer = () => {
  http.createServer(server.reqRes).listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};

server.reqRes = reqResHelper.reqRes;

// init server
server.init = () => {
  server.createServer();
};

// export module
module.exports = server;
