const twilio = require('twilio');
const logger = require('../config/logger');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const isTwilioConfigured = () => {
  if (!accountSid || !authToken || !fromPhone) return false;
  if (accountSid.includes('your_twilio') || authToken.includes('your_twilio') || fromPhone.includes('your_twilio')) return false;
  return true;
};

let client = null;

if (isTwilioConfigured()) {
  try {
    client = twilio(accountSid, authToken);
    logger.info('Twilio SMS service initialized successfully.');
  } catch (error) {
    logger.error(`Failed to initialize Twilio client: ${error.message}`);
  }
} else {
  logger.warn('Twilio SMS settings are not fully configured. Using fallback Console SMS sender.');
}

/**
 * Send an SMS message
 * @param {Object} options
 * @param {string} options.to - Recipient phone number (e.g., +1234567890)
 * @param {string} options.body - The message content
 * @returns {Promise<boolean>}
 */
const sendSMS = async ({ to, body }) => {
  if (!client) {
    logger.info(`[Fallback SMS] Sending SMS to: ${to} | Message: ${body}`);
    console.log(`\n==================================================`);
    console.log(`[FALLBACK SMS] To: ${to}`);
    console.log(`Message: ${body}`);
    console.log(`==================================================\n`);
    return true;
  }

  try {
    const message = await client.messages.create({
      body,
      from: fromPhone,
      to
    });
    logger.info(`SMS sent successfully to ${to}. Message SID: ${message.sid}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send SMS to ${to}: ${error.message}`);
    console.log(`\n==================================================`);
    console.log(`[FAILED SMS FALLBACK] To: ${to}`);
    console.log(`Message: ${body}`);
    console.log(`==================================================\n`);
    return false;
  }
};

module.exports = {
  sendSMS,
  isTwilioConfigured
};
