const Member = require('../schemas/member.schema');
const { BadRequestError } = require('../utils/errors');
const cryptoUtils = require('../utils/crypto');
const { enqueueTask } = require('./queue.service');
const ErrorCodes = require('../constants/errorCodes');
const redis = require('../config/queue');

/**
 * Authenticate existing credentials and grant token using Member model
 * @param {Object} credentials - User credentials (email, password)
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Retrieve member by email
  const member = await Member.findOneByEmail(email);
  if (!member) {
    throw new BadRequestError(
      'Invalid email or password combination.',
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  // Validate passwords (since password is inside credentials.password)
  const isMatch = await cryptoUtils.comparePassword(password, member.credentials.password);
  if (!isMatch) {
    throw new BadRequestError(
      'Invalid email or password combination.',
      ErrorCodes.AUTH_INVALID_CREDENTIALS
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
  loginUser,
};
