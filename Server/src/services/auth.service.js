const Member = require('../schemas/member.schema');
const { BadRequestError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');
const { enqueueTask } = require('./queue.service');
const ErrorCodes = require('../constants/errorCodes');
const redis = require('../config/queue');
const mailer = require('../utils/mailer');
const logger = require('../config/logger');

const preValidateLogin = async (credentials) => {
  const { email, password } = credentials;

  // Retrieve member by email
  const member = await Member.findOneByEmail(email);
  if (!member) {
    throw new BadRequestError(
      'Invalid email or password combination.',
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  const dbPassword = member.credentials.password;
  let isMatch = false;

  if (typeof dbPassword === 'string' && dbPassword.startsWith('$2')) {
    isMatch = await cryptoUtils.comparePassword(password, dbPassword);
  } else {
    // If the database password is plain-text, compare, hash, and save it to the DB
    isMatch = (password === dbPassword);
    if (isMatch && password) {
      try {
        const hashedPassword = await cryptoUtils.hashPassword(password);
        member.credentials.password = hashedPassword;
        await member.save();
        logger.info(`Automatically hashed and saved plain-text password in Firestore for user: ${email}`);
      } catch (saveError) {
        logger.error(`Failed to automatically hash and save password for user ${email}: ${saveError.message}`);
      }
    }
  }

  if (!isMatch) {
    throw new BadRequestError(
      'Invalid email or password combination.',
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  // Generate dynamic 6-digit verification code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `otp:login:${email.toLowerCase()}`;

  // Store in Redis cache for 5 minutes (300 seconds)
  await redis.set(redisKey, otpCode, 'EX', 300);

  // Output OTP code to logger for manual testing
  logger.info(`[TEST OTP] Login verification OTP code for ${email} is: ${otpCode}`);

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">BookMyVenue</h1>
      </div>
      <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
        <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Login Verification</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">Please use the following one-time password (OTP) to log in to your account:</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #4f46e5; background-color: #eef2ff; padding: 14px 28px; border-radius: 10px; border: 1px dashed #818cf8; display: inline-block;">${otpCode}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">This code is valid for 5 minutes. Please do not share this code with anyone.</p>
      </div>
      <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
        &copy; 2026 BookMyVenue. All rights reserved.
      </div>
    </div>
  `;

  // Send the verification email in the background to prevent SMTP connection blocks from hanging the request (Render blocks port 587 by default)
  mailer.sendEmail({
    to: email,
    subject: `[BookMyVenue] Login Verification - OTP: ${otpCode}`,
    html: emailHtml
  }).catch((err) => {
    logger.error(`Failed to send verification email: ${err.message}`);
  });

  return {
    email: member.email_id,
    otpRequired: true
  };
};


const verifyOtpLogin = async (email, otp) => {
  const redisKey = `otp:login:${email.toLowerCase()}`;
  const savedOtp = await redis.get(redisKey);

  if (!savedOtp || savedOtp !== otp) {
    throw new BadRequestError(
      'Invalid or expired OTP verification code.',
      'VALIDATION_FAILED'
    );
  }

  // Clean up OTP key from cache
  await redis.del(redisKey);

  // Retrieve member by email
  const member = await Member.findOneByEmail(email);
  if (!member) {
    throw new BadRequestError(
      'User not found.',
      ErrorCodes.USER_NOT_FOUND
    );
  }

  // Generate session tokens (member_id 1 = VENUE_OWNER, 2 = USER)
  const tokenPayload = { id: member.id, role: member.member_id === 1 ? 'VENUE_OWNER' : 'USER' };
  const accessToken = cryptoUtils.generateToken(tokenPayload);
  const refreshToken = cryptoUtils.generateRefreshToken(tokenPayload);

  // Store refresh token in Redis (7 days TTL)
  await redis.set(`refresh_token:${refreshToken}`, JSON.stringify(tokenPayload), 'EX', 604800);

  // Dispatch asynchronous user audit job
  await enqueueTask('audit_log', {
    userId: member.id,
  }).catch(() => {
    // Graceful swallow
  });

  return {
    user: {
      id: member.id,
      name: member.identifier,
      email: member.email_id,
      role: member.member_id === 1 ? 'VENUE_OWNER' : 'USER',
    },
    accessToken,
    refreshToken,
  };
};

module.exports = {
  preValidateLogin,
  verifyOtpLogin,
};

