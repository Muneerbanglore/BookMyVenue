const authService = require('../services/auth.service');
const { formatSuccess } = require('../utils/formatters');
const asyncHandler = require('../utils/asyncHandler');
const HttpStatusCodes = require('../constants/httpStatusCodes');
const redis = require('../config/queue');
const cryptoUtils = require('../utils/crypto');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');

/**
 * @desc    Pre-validate credentials and dispatch OTP
 * @route   POST /api/v1/auth/prevalidation
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.preValidateLogin(req.body);
  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('Credentials verified. Verification OTP sent to your registered email address.', result));
});

/**
 * @desc    Verify OTP and complete authentication, issuing tokens
 * @route   POST /api/v1/auth/validation
 * @access  Public
 */
const otpLogin = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new BadRequestError('Email and OTP are required.', 'VALIDATION_FAILED');
  }

  const result = await authService.verifyOtpLogin(email, otp);
  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('User authenticated successfully.', result));
});

/**
 * @desc    Refresh session access token using a valid refresh token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
const refresh = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError('Refresh token is required.', 'VALIDATION_FAILED');
  }

  try {
    // 1. Verify token signature
    const decoded = cryptoUtils.verifyToken(refreshToken);

    // 2. Verify token exists in Redis cache
    const cachedData = await redis.get(`refresh_token:${refreshToken}`);
    if (!cachedData) {
      throw new UnauthorizedError('Session has expired or is invalid. Please log in again.');
    }

    const payload = JSON.parse(cachedData);

    // 3. Generate new short-lived Access Token & rotated long-lived Refresh Token
    const tokenPayload = { id: payload.id, role: payload.role };
    const newAccessToken = cryptoUtils.generateToken(tokenPayload);
    const newRefreshToken = cryptoUtils.generateRefreshToken(tokenPayload);

    // 4. Update Redis cache (Delete old token, store new rotated token with 7d TTL)
    await redis.del(`refresh_token:${refreshToken}`);
    await redis.set(`refresh_token:${newRefreshToken}`, JSON.stringify(tokenPayload), 'EX', 604800);

    res.status(HttpStatusCodes.OK).json(
      formatSuccess('Tokens refreshed successfully.', {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
    );
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired refresh token.'));
  }
});

/**
 * @desc    Invalidate refresh token session and log out
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Delete the refresh token session from Redis cache
    await redis.del(`refresh_token:${refreshToken}`);
  }

  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('Logged out successfully.'));
});

module.exports = {
  login,
  otpLogin,
  refresh,
  logout,
};
