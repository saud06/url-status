/*
 * Title: Notifications
 * Description: Notify users
 * Author: Saud
 * Date: 01-26-2021
 */

// Dependencies
const nodemailer = require('nodemailer');
const validateEmail = require('email-validator');
const environments = require('./environments');
const twilio = require('twilio')(environments.twilio.accountSid, environments.twilio.authToken);

// Module scaffolding
const notifications = {};

// Configuration
notifications.config = {};

// Send Twilio sms
notifications.sendTwilioSms = (phone, msg, callback) => {
  const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone : null;

  const userMsg =    typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg : null;

  if (userPhone && userMsg) {
    const payload = {
      from: environments.twilio.from,
      to: `+88${userPhone}`,
      body: userMsg,
    };

    twilio.messages.create(payload, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(false);
      }
    });
  } else {
    callback(400, {
      message: 'Invalid user request',
    });
  }
};

// Send email
notifications.sendEmail = (to, subject, msg, callback) => {
  const recipientEmail =    typeof to === 'string' && to.length > 0 && validateEmail.validate(to) ? to : null;

  const transport = nodemailer.createTransport({
    service: environments.email.service,
    auth: environments.email.auth,
  });

  const mailOptions = {
    from: environments.email.auth.user,
    to: recipientEmail,
    subject,
    text: msg,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (!err) {
      callback(info);
    } else {
      callback(err);
    }
  });
};

// Export module
module.exports = notifications;
