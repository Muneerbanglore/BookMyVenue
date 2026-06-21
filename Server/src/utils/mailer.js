const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

// Helper to check if SMTP settings are placeholders or not configured
const isSmtpConfigured = () => {
  if (!smtpHost || !smtpUser || !smtpPass) return false;
  if (smtpUser.includes('your_email') || smtpPass.includes('your_gmail')) return false;
  return true;
};

let transporter = null;

if (isSmtpConfigured()) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
  logger.info(`SMTP Mailer initialized with host: ${smtpHost}:${smtpPort}`);
} else {
  logger.warn('SMTP settings are not fully configured. Using fallback Console Mailer.');
}


const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    logger.info(`[Fallback Mailer] Sending email to: ${to} | Subject: ${subject}`);
    console.log(`\n==================================================`);
    console.log(`[FALLBACK EMAIL] To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`); // strip HTML tags for console readability
    console.log(`==================================================\n`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html
    });
    logger.info(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    console.log(`\n==================================================`);
    console.log(`[FAILED SMTP EMAIL FALLBACK] To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    console.log(`==================================================\n`);
    return false;
  }
};

module.exports = {
  sendEmail,
  isSmtpConfigured
};
