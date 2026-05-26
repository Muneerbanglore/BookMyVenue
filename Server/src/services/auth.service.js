const User = require('../models/user.model');
const { ConflictError, BadRequestError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');
const { enqueueTask } = require('./queue.service');
const ErrorCodes = require('../constants/errorCodes');
const redis = require('../config/queue');

/**
 * Register a new user profile
 * @param {Object} userData - User register details
 */
const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('A user profile already exists with this email address.');
  }

  // Save new user instance to database
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Generate session tokens
  const tokenPayload = { id: user._id, role: user.role };
  const accessToken = cryptoUtils.generateToken(tokenPayload);
  const refreshToken = cryptoUtils.generateRefreshToken(tokenPayload);

  // Store refresh token in Redis (7 days TTL)
  await redis.set(`refresh_token:${refreshToken}`, JSON.stringify(tokenPayload), 'EX', 604800);

  // Asynchronously dispatch background setup notifications
  await enqueueTask('email_notification', {
    email: user.email,
    name: user.name,
  }).catch(() => {
    // Graceful swallow: queue errors shouldn't break core user registration
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Authenticate existing credentials and grant token
 * @param {Object} credentials - User credentials (email, password)
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Retrieve user with password select explicitly enabled
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new BadRequestError(
      'Invalid email or password combination.',
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  // Validate passwords
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new BadRequestError(
      'Invalid email or password combination.',
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  // Generate session tokens
  const tokenPayload = { id: user._id, role: user.role };
  const accessToken = cryptoUtils.generateToken(tokenPayload);
  const refreshToken = cryptoUtils.generateRefreshToken(tokenPayload);

  // Store refresh token in Redis (7 days TTL)
  await redis.set(`refresh_token:${refreshToken}`, JSON.stringify(tokenPayload), 'EX', 604800);

  // Dispath asynchronous user audit job
  await enqueueTask('audit_log', {
    userId: user._id,
  }).catch(() => {
    // Graceful swallow
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
