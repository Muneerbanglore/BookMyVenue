const Member = require('../models/member.model');
const masterData = require('../constants/onboardingMasterData');
const { BadRequestError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');
const redis = require('../config/queue');
const logger = require('../config/logger');
const mailer = require('../utils/mailer');
const sms = require('../utils/sms');
const db = require('../config/firebase');

/**
 * Retrieve static onboarding master dropdown lists
 */
const getOnboardingDropdowns = async (req, res, next) => {
  try {
    let roles = [];
    if (db) {
      try {
        const rolesSnapshot = await db.collection('roles').get();
        roles = rolesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || doc.id,
            ...data
          };
        });
      } catch (error) {
        logger.warn(`Failed to fetch roles from Firestore: ${error.message}`);
        roles = [
          { id: 'VENUE_OWNER', name: 'Venue Owner' },
          { id: 'USER', name: 'User' }
        ];
      }
    } else {
      roles = [
        { id: 'VENUE_OWNER', name: 'Venue Owner' },
        { id: 'USER', name: 'User' }
      ];
    }

    if (roles.length === 0) {
      roles = [
        { id: 'VENUE_OWNER', name: 'Venue Owner' },
        { id: 'USER', name: 'User' }
      ];
    }

    res.status(200).json({
      success: true,
      data: {
        countries: masterData.countries,
        currencies: masterData.currencies,
        timezones: masterData.timezones,
        themes: masterData.themes,
        locales: masterData.locales,
        roles
      }
    });
  } catch (error) {
    next(error);
  }
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
        is_email: authProvider && authProvider.type === 'GOOGLE' ? true : (verificationStatus ? verificationStatus.isEmailVerified : false),
        is_google_auth: authProvider && authProvider.type === 'GOOGLE',
        is_mobile_number: verificationStatus ? verificationStatus.isPhoneVerified : false
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

    // If type is email, trigger nodemailer to send the OTP
    if (type === 'email') {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">BookMyVenue</h1>
          </div>
          <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Verify Your Email Address</h2>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">Thank you for registering with BookMyVenue! To complete your verification, please use the following one-time password (OTP):</p>
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
      await mailer.sendEmail({
        to: target,
        subject: `[BookMyVenue] Verify Your Email Address - OTP: ${otpCode}`,
        html: emailHtml
      });
    }

    // If type is phone, trigger twilio to send the OTP
    if (type === 'phone') {
      await sms.sendSMS({
        to: target,
        body: `Your BookMyVenue verification code is: ${otpCode}. This code is valid for 5 minutes.`
      });
    }

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
