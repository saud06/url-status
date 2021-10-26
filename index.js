/*
 * Title: Index
 * Description: Server lands here before start
 * Author: Saud
 * Date: 01-20-2021
 */

// Dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

// Module scaffolding
const app = {};

// Configuration
app.config = {};

app.init = () => {
  // start the server
  server.init();

  // start the worker
  worker.init();
};

app.init();
