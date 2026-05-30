const Member = require('../schemas/member.schema');
const { BadRequestError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');
const redis = require('../config/queue');
const logger = require('../config/logger');
const mailer = require('../utils/mailer');
const sms = require('../utils/sms');
const db = require('../config/firebase');
const onboardingService = require('../services/onboarding.service');

/**
 * Helper utility to fetch and map a Firestore collection with fallbacks.
 */
const fetchCollection = async (collectionName, isStringArray = false) => {
  if (!db) return [];
  try {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => {
      const data = doc.data();
      if (isStringArray) {
        return data.value || data.name || doc.id;
      }
      return {
        _id: doc.id,
        id: doc.id,
        ...data
      };
    });
  } catch (error) {
    logger.warn(`Failed to fetch ${collectionName} from Firestore: ${error.message}`);
    return [];
  }
};

/**
 * Retrieve static onboarding master dropdown lists from database collections
 */
const getOnboardingDropdowns = async (req, res, next) => {
  try {
    const countries = await fetchCollection('countries');
    const currencies = await fetchCollection('currencies');
    const timezones = await fetchCollection('timezones');
    const themes = await fetchCollection('themes', true);
    const locales = await fetchCollection('locales', true);
    const roles = await fetchCollection('roles');

    res.status(200).json({
      success: true,
      data: {
        countries,
        currencies,
        timezones,
        themes,
        locales,
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
  try {
    const member = await onboardingService.createOnboardingAccount(req.body);

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
 * Compare code against Redis or verify Firebase ID Token if type is email.
 */
const verifyOTP = async (req, res, next) => {
  const { type, target, code, token, userId } = req.body;

  if (!type || !target) {
    return next(
      new BadRequestError('Type and target are required.', 'VALIDATION_FAILED')
    );
  }

  try {
    // If type is email, verify Firebase ID token (Google Auth)
    if (type === 'email') {
      const verificationToken = token || code;
      if (!verificationToken) {
        return next(
          new BadRequestError('Firebase ID Token is required for email verification.', 'VALIDATION_FAILED')
        );
      }

      // Verify the ID token using the Firebase Admin SDK
      const admin = require('firebase-admin');
      const decodedToken = await admin.auth().verifyIdToken(verificationToken);

      const verifiedEmail = decodedToken.email;
      const isEmailVerified = decodedToken.email_verified;

      if (!verifiedEmail || !isEmailVerified) {
        return next(
          new BadRequestError('Email address is not verified in the provided Firebase credentials.', 'VALIDATION_FAILED')
        );
      }

      // Update user verification status in Firestore
      if (userId) {
        const member = await Member.findById(userId);
        if (member) {
          member.varification.is_email = true;
          await member.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Email verification successful.',
        data: {
          email: verifiedEmail
        }
      });
    }

    // Phone verification flow (Redis OTP sent via Twilio)
    if (type === 'phone') {
      if (!code) {
        return next(
          new BadRequestError('Verification code is required.', 'VALIDATION_FAILED')
        );
      }

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

      // Update user verification status in Firestore
      if (userId) {
        const member = await Member.findById(userId);
        if (member) {
          member.varification.is_mobile_number = true;
          if (!member.phone_number) {
            member.phone_number = target;
          }
          await member.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Phone number verification successful.'
      });
    }

    return next(
      new BadRequestError('Invalid verification type specified.', 'VALIDATION_FAILED')
    );
  } catch (error) {
    if (type === 'email') {
      logger.error(`Firebase ID Token Verification failed: ${error.message}`);
      return next(
        new BadRequestError('Verification failed: Invalid or expired Firebase ID token.', 'VALIDATION_FAILED')
      );
    }
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
