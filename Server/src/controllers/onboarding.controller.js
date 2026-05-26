const Member = require('../models/member.model');
const masterData = require('../constants/onboardingMasterData');
const { BadRequestError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');
const redis = require('../config/queue');
const logger = require('../config/logger');

/**
 * Retrieve static onboarding master dropdown lists
 */
const getOnboardingDropdowns = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      countries: masterData.countries,
      currencies: masterData.currencies,
      timezones: masterData.timezones,
      themes: masterData.themes,
      locales: masterData.locales
    }
  });
};

/**
 * Validate input payload and check email/phone availability
 */
const preValidate = async (req, res, next) => {
  const { personalData } = req.body;

  try {
    // Check if email already registered
    const existingEmail = await Member.findOneByEmail(personalData.email);
    if (existingEmail) {
      return next(
        new BadRequestError('The request payload contains invalid or missing data.', 'VALIDATION_FAILED', [
          {
            field: 'personalData.email',
            rejectedValue: personalData.email,
            reason: 'A user profile already exists with this email address.'
          }
        ])
      );
    }

    // Check if phone number already registered
    const existingPhone = await Member.findOneByPhone(personalData.phoneNumber);
    if (existingPhone) {
      return next(
        new BadRequestError('The request payload contains invalid or missing data.', 'VALIDATION_FAILED', [
          {
            field: 'personalData.phoneNumber',
            rejectedValue: personalData.phoneNumber,
            reason: 'A user profile already exists with this phone number.'
          }
        ])
      );
    }

    res.status(200).json({
      success: true,
      message: 'Payload is valid and available for registration.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Perform validation and register the new user/member record
 */
const createAccount = async (req, res, next) => {
  const { authProvider, personalData, location, verificationStatus, preferences, role, password } = req.body;

  try {
    // Duplicate check for Email
    const existingEmail = await Member.findOneByEmail(personalData.email);
    if (existingEmail) {
      return next(
        new BadRequestError('The request payload contains invalid or missing data.', 'VALIDATION_FAILED', [
          {
            field: 'personalData.email',
            rejectedValue: personalData.email,
            reason: 'A user profile already exists with this email address.'
          }
        ])
      );
    }

    // Duplicate check for Phone
    const existingPhone = await Member.findOneByPhone(personalData.phoneNumber);
    if (existingPhone) {
      return next(
        new BadRequestError('The request payload contains invalid or missing data.', 'VALIDATION_FAILED', [
          {
            field: 'personalData.phoneNumber',
            rejectedValue: personalData.phoneNumber,
            reason: 'A user profile already exists with this phone number.'
          }
        ])
      );
    }

    // Map role type to numeric member_id (1 = VENUE_OWNER, 2 = USER)
    const member_id = role === 'VENUE_OWNER' ? 1 : 2;

    const identifier = `${personalData.firstName}_${personalData.lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');

    // Create the member record
    const memberData = {
      email_id: personalData.email,
      identifier,
      member_id,
      phone_number: personalData.phoneNumber,
      credentials: {
        googile_auth_id: authProvider && authProvider.type === 'GOOGLE' ? authProvider.providerId : '',
        password: password ? await cryptoUtils.hashPassword(password) : ''
      },
      varification: {
        is_email: authProvider && authProvider.type === 'GOOGLE' ? true : verificationStatus.isEmailVerified,
        is_google_auth: authProvider && authProvider.type === 'GOOGLE',
        is_mobile_number: verificationStatus.isPhoneVerified
      }
    };

    const member = await Member.create(memberData);

    res.status(201).json({
      success: true,
      message: 'User account created successfully.',
      data: {
        userId: member.id,
        createdAt: member.createdAt,
        status: 'ACTIVE',
        requiresOnboardingStep2: false
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate and store a temporary verification OTP in Redis
 */
const sendOTP = async (req, res, next) => {
  const { type, target } = req.body;

  if (!type || !target) {
    return next(
      new BadRequestError('Type (email/phone) and target (email or phone string) are required.', 'VALIDATION_FAILED')
    );
  }

  try {
    // Generate 6-digit verification code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `otp:${type}:${target}`;

    // Store in Redis cache for 5 minutes (300 seconds)
    await redis.set(redisKey, otpCode, 'EX', 300);

    // Output OTP code to winston logger for manual testing
    logger.info(`[TEST OTP] Verification OTP code for ${type} (${target}) is: ${otpCode}`);

    res.status(200).json({
      success: true,
      message: `Verification OTP successfully sent to ${target}.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compare code against Redis. If correct, mark verification flag as true.
 */
const verifyOTP = async (req, res, next) => {
  const { type, target, code, userId } = req.body;

  if (!type || !target || !code) {
    return next(
      new BadRequestError('Type, target, and verification code are required.', 'VALIDATION_FAILED')
    );
  }

  try {
    const redisKey = `otp:${type}:${target}`;
    const savedOtp = await redis.get(redisKey);

    if (!savedOtp || savedOtp !== code) {
      return next(
        new BadRequestError('The request payload contains invalid or missing data.', 'VALIDATION_FAILED', [
          {
            field: 'code',
            rejectedValue: code,
            reason: 'Invalid or expired OTP verification code.'
          }
        ])
      );
    }

    // Clean up OTP key from cache
    await redis.del(redisKey);

    // If userId provided, hydrate the record and update Firestore verification flags
    if (userId) {
      const member = await Member.findById(userId);
      if (member) {
        if (type === 'email') {
          member.varification.is_email = true;
        } else if (type === 'phone') {
          member.varification.is_mobile_number = true;
        }
        await member.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Verification successful.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOnboardingDropdowns,
  preValidate,
  createAccount,
  sendOTP,
  verifyOTP
};
