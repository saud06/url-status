/*
 * Title: Req. Res. Handler
 * Description: This file handles req. & res. data
 * Author: Saud
 * Date: 2021-10-20
 */

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const notFoundHandler = require('../handlers/routeHandlers/notFoundHandler');
const utilities = require('./utilities');

// Module scaffolding
const reqResHelper = {};

// Configuration
reqResHelper.config = {};

reqResHelper.reqRes = (req, res) => {
  const decoder = new StringDecoder('utf-8');
  const parsedURL = url.parse(req.url, true);
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryStrObj = parsedURL.query;
  const headerObj = req.headers;

  const reqObj = {
    parsedURL,
    path,
    trimmedPath,
    method,
    queryStrObj,
    headerObj,
  };

  const reqHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler.notFound;

  let resData = '';
  req.on('data', (chunk) => {
    resData += decoder.write(chunk);
  });

  req.on('end', () => {
    resData += decoder.end();

    reqObj.body = utilities.parseJson(resData);

    reqHandler(reqObj, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload = typeof payload === 'object' ? payload : {};

      const payloadStr = JSON.stringify(payload);

      res.writeHead(statusCode, { 'content-type': 'application/json' });
      res.write(payloadStr);
      res.end();
    });
  });
};

// Export module
module.exports = reqResHelper;
