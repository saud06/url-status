/*
 * Title: Worker
 * Description: Works to get up or down status of the URL
 * Author: Saud
 * Date: 01-27-2021
 */

// Dependencies
const http = require('http');
const https = require('https');
const _ = require('lodash');
const url = require('url');
const data = require('./data');
const utilities = require('../helpers/utilities');
const notifications = require('../helpers/notifications');

// Module scaffolding
const worker = {};

// Configuration
worker.config = {};

// Alert user as notification
worker.alertUser = (modCheckListDataObj) => {
  const recipientPhone = modCheckListDataObj.tokenPhone;
  const alertUrl = `${modCheckListDataObj.protocol}://${modCheckListDataObj.url}`;
  const msg = `A URL ${alertUrl} is ${modCheckListDataObj.state} now.`;

  // Notify with twilio
  notifications.sendTwilioSms(recipientPhone, msg, (err) => {
    if (!err) {
      console.log(msg);
    } else {
      console.log(err);
    }
  });

  // Notify with email
  const to = 'saud.mn6@gmail.com';
  const subject = 'Up / Down link status';

  notifications.sendEmail(to, subject, msg, (err, info) => {
    if (!err) {
      console.log(info);
    } else {
      console.log(err);
    }
  });
};

// Update check list file
worker.updateCheckList = (checkListDataObj, outcome) => {
  const modCheckListDataObj = checkListDataObj;
  const statusCodeStatus = modCheckListDataObj.statusCode.indexOf(outcome.statusCode) > -1;
  const state = !outcome.error && outcome.statusCode && statusCodeStatus ? 'up' : 'down';
  const alert = !!(modCheckListDataObj.lastCheck && modCheckListDataObj.state !== state);

  modCheckListDataObj.lastCheck = Date.now();
  modCheckListDataObj.state = state;

  // Update check list
  data.update('checkListDataFolder', modCheckListDataObj.id, modCheckListDataObj, (err) => {
    if (!err) {
      // Alert the user
      if (alert) {
        worker.alertUser(modCheckListDataObj);
      } else {
        console.log('No state change.');
      }
    } else {
      console.log(err);
    }
  });
};

// Finalize before updating check list file
worker.operationOnCheckList = (checkListDataObj) => {
  const parsedUrl = url.parse(`${checkListDataObj.protocol}://${checkListDataObj.url}`, true);

  const requestDetails = {
    protocol: `${checkListDataObj.protocol}:`,
    hostname: parsedUrl.hostname,
    method: checkListDataObj.method.toUpperCase(),
    path: parsedUrl.path,
    timeout: checkListDataObj.timeout * 1000,
  };

  const protocol = checkListDataObj.protocol === 'http' ? http : https;

  let outcome = {
    error: false,
    value: null,
  };
  let outcomeStatus = false;

  const req = protocol.request(requestDetails, (res) => {
    outcome.statusCode = res.statusCode;

    // Update check list data
    if (!outcomeStatus) {
      worker.updateCheckList(checkListDataObj, outcome);

      outcomeStatus = true;
    }
  });

  // Handle error
  req.on('error', (error) => {
    outcome = {
      error: true,
      value: error,
    };

    // Update check list data
    if (!outcomeStatus) {
      worker.updateCheckList(checkListDataObj, outcome);

      outcomeStatus = true;
    }
  });

  // Handle timeout
  req.on('timeout', (timeout) => {
    outcome = {
      error: true,
      value: timeout,
    };

    // Update check list data
    if (!outcomeStatus) {
      worker.updateCheckList(checkListDataObj, outcome);

      outcomeStatus = true;
    }
  });

  req.end();
};

// Validate check list file
worker.validateCheckList = (checkListDataObj) => {
  if (!_.isEmpty(checkListDataObj)) {
    checkListDataObj.state =      typeof checkListDataObj.state && ['up', 'down'].indexOf(checkListDataObj.state) > -1
        ? checkListDataObj.state
        : null;

    checkListDataObj.lastCheck =      typeof checkListDataObj.lastCheck === 'number' && checkListDataObj.lastCheck > 0
        ? checkListDataObj.lastCheck
        : null;

    worker.operationOnCheckList(checkListDataObj);
  } else {
    console.log('Invalid check list data.');
  }
};

// Get check list
worker.getCheckList = () => {
  data.list('checkListDataFolder', (err, files) => {
    if (!err && files && files.length > 0) {
      files.forEach((file) => {
        // Read check list file data
        data.read('checkListDataFolder', file, (err2, checkListData) => {
          if (!err2 && checkListData) {
            const checkListDataObj = { ...utilities.parseJson(checkListData) };

            // Validate check list file data
            worker.validateCheckList(checkListDataObj);
          } else {
            console.log(err2);
          }
        });
      });
    } else {
      console.log('File not found.');
    }
  });
};

// init worker
worker.init = () => {
  worker.getCheckList();

  // Get check list every one minute
  setInterval(() => {
    worker.getCheckList();
  }, 60000);
};

// export module
module.exports = worker;
